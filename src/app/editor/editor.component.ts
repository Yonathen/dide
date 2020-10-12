import { EditorState } from './../navigation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSidebar } from './model/event-sidebar';
import { ScriptLoaderService } from './services/script-loader.service';
import { NavigationService } from 'src/app/navigation.service';
import { MenuItem } from 'primeng/api';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../documents/services/document.service';
import { FileFolder } from 'api/server/models/file-folder';
import { LoideRoute } from '../shared/enums/loide-route';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoideToolbarItems } from './enums/loide-toolbar-items.enum';

export const EditorTabTag = 'EDITOR_TAB_';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public content: any;
  public sidebarEvent: EventSidebar;
  public sidebarLeft: boolean;
  public sidebarRight: boolean;
  public editorState: EditorState;
  public documentChanged: boolean;
  public editorMenuItems: MenuItem[] = [];

  @ViewChild('editor', { static: true })
  editor: AceEditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private documentService: DocumentService,
    private spinner: NgxSpinnerService,
    private navigationService: NavigationService,
    private scriptLoaderService: ScriptLoaderService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const documentId: string = queryParams.get('item');
      this.getDocumentById(documentId);
    });

    this.navigationService.menu.subscribe( menuItems => {
      this.editorMenuItems.splice(0, this.editorMenuItems.length);
      menuItems.forEach(item => {
        this.editorMenuItems.push(item);
      });
    });

    this.navigationService.active.subscribe(activeState => {
      this.editorState = activeState;
    });
  }

  get sidebarLeftVisible(): boolean {
    return this.sidebarLeft;
  }

  get sidebarRightVisible(): boolean {
    return this.sidebarRight;
  }

  getDocumentById(id: string) {
    this.spinner.show();
    this.documentService.getFileFolder(id).then(value => {
      this.spinner.hide();
      if ( value.success ) {
        this.setEditorMenuItem(value.returnValue);
      }
    });
  }

  setEditorMenuItem(document: FileFolder) {

    const tabId = EditorTabTag + document._id;
    if ( !this.navigationService.tabExist(tabId) ) {
      const fileMenuItem: MenuItem = {
        id: tabId,
        icon: 'icon icon-file',
        label: document.name,
        routerLink: LoideRoute.Editor,
        queryParams: { item: document._id}
      };
      this.navigationService.inject(fileMenuItem);
    }
    this.navigationService.setEditorState(tabId, document);
  }

  onToolbarEvent($event: LoideToolbarItems) {
    switch ($event) {
      case LoideToolbarItems.SaveFile:
        this.saveDocument();
        break;
    }
  }

  toggleSidebarLeft($event: EventSidebar) {
    this.sidebarEvent = $event;

    if (this.sidebarEvent.left) {
      this.sidebarLeft = this.sidebarEvent.visible;
    } else if (this.sidebarEvent.right) {
      this.sidebarRight = this.sidebarEvent.visible;
    }
  }

  isSingleBarOpen(): boolean {
    if ((this.sidebarRight && !this.sidebarLeft) ||
      (!this.sidebarRight && this.sidebarLeft)) {
        return true;
      }
    return false;
  }

  isBothBarOpen(): boolean {
    if (this.sidebarRight && this.sidebarLeft) {
      return true;
    }
    return false;
  }

  isChanged(editorState: EditorState): boolean {
    return editorState && editorState.changed;
  }

  closeItem(event, item) {
    this.navigationService.closeEditorTab(item);
    event.preventDefault();
  }

  saveDocument() {
    if ( this.editorState && this.editorState.changed ) {
      this.documentService.updateDocument(this.editorState.currentDocument._id, this.editorState.currentDocument.content).then( value => {
        if ( value.success ) {
          this.setEditorState(value.returnValue);
        }
      });
    }
  }

  setEditorState(document) {
    const tabId = EditorTabTag + document._id;
    if ( this.navigationService.tabExist(tabId) ) {
      this.navigationService.setEditorState(tabId, document);
      this.navigationService.documentChanged(tabId, false);
    }
  }

}
