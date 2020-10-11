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
  public selectedDocument: FileFolder;
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
        this.selectedDocument = value.returnValue;
        this.setEditorMenuItem(value.returnValue);
      }
    });
  }

  setEditorMenuItem(document: FileFolder) {
    const fileMenuItem: MenuItem = {
      id: EditorTabTag + document._id,
      icon: 'icon icon-file',
      state: { data: document },
      label: document.name,
      routerLink: LoideRoute.Editor,
      queryParams: { item: document._id}
    };
    if ( !this.navigationService.tabExist(fileMenuItem) ) {
      this.navigationService.inject(fileMenuItem);
    }
  }

  toogleSidebarLeft($event: EventSidebar) {
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

  closeItem(event, item) {
    this.navigationService.closeEditorTab(item);
    event.preventDefault();
  }

}
