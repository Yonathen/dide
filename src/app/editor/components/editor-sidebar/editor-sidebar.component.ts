import { DideSidebarItemsBottom } from './../../enums/dide-sidebar-items.enum';
import { NavigationService, EditorState } from 'src/app/navigation.service';
import { FileFolder, FileType } from 'api/server/models/file-folder';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { DideSidebarItemsLeft, DideSidebarItemsRight } from '../../enums/dide-sidebar-items.enum';
import { EventSidebar } from '../../model/event-sidebar'
import { DideMenuItem } from 'src/app/shared/model/menu-item';
import { TreeNode } from 'primeng/api/treenode';
import { Tree } from 'primeng/tree/tree';
import { ResizePanel } from '../../editor.component';
import { Observable } from 'rxjs';
import { Group } from 'api/server/models/group';
import { util } from 'api/server/lib/util';

@Component({
  selector: 'app-editor-sidebar',
  templateUrl: './editor-sidebar.component.html',
  styleUrls: ['./editor-sidebar.component.scss']
})
export class EditorSidebarComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() positionRight: boolean = false;
  @Input() panel: ResizePanel;
  @Input() openByResize: boolean = false;
  @Input() privateDocuments: TreeNode[] = [];
  @Input() publicDocuments: TreeNode[] = [];
  @Input() editorState: EditorState;

  public panelOpt = ResizePanel;
  public folderSelected: TreeNode;
  public sidebarLeft = DideSidebarItemsLeft;
  public sidebarRight = DideSidebarItemsRight;
  public sidebarMenuItems: DideMenuItem[];
  public activeSidebar: EventSidebar = {} as EventSidebar;

  @Output('onClickSidebar') sidebarClickEmitter: EventEmitter<EventSidebar> = new EventEmitter<EventSidebar>();

  @Output() clearOutput: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('directoryTree') directoryTree: Tree;

  @Input() outputEvent: Observable<void>;

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    if (this.isPanel(ResizePanel.Left)) {
      this.sidebarMenuItems = [
        { id: DideSidebarItemsLeft.PublicDocument, iconClass: 'icon-document-public', labelIndex: 'document.public_document'},
        { id: DideSidebarItemsLeft.PrivateDocument, iconClass: 'icon-folder_shared', labelIndex: 'document.private_document'}
      ];
    } else if (this.isPanel(ResizePanel.Right)) {
      this.sidebarMenuItems = [
        { id: DideSidebarItemsRight.Language, iconClass: 'icon-translate', labelIndex: 'preference.language'},
        { id: DideSidebarItemsRight.Group, iconClass: 'icon-group', labelIndex: 'common.group'},
        { id: DideSidebarItemsRight.Appearance, iconClass: 'icon-appearance', labelIndex: 'preference.appearance'},
        { id: DideSidebarItemsRight.Filter, iconClass: 'icon-filter_list_alt', labelIndex: 'editor.filter'}
      ];
    } else if (this.isPanel(ResizePanel.Bottom)) {
      this.sidebarMenuItems = [
        { id: DideSidebarItemsBottom.Terminal, iconClass: '', labelIndex: 'common.terminal'}
      ];
    }

  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes && changes.openByResize ) {
      if ( this.openByResize && !( util.valueExist(this.activeSidebar) && this.activeSidebar.visible ) ) {
        this.openSidebar(this.sidebarMenuItems[0].id);
      } else {
        this.closeSidebar(false);
      }
    }

    if ( changes && changes.outputEvent && this.outputEvent ) {
      this.outputEvent.subscribe(() => {
        if ( !this.isSidebarOpen ) {
          this.navigateSidebar(this.sidebarMenuItems[0].id);
        }
      });
    }
  }

  interceptOnNodeClick(event, node) {
    event.preventDefault();
    this.openFile( node.data );
  }

  get isSidebarOpen(): boolean {
    return this.activeSidebar && this.activeSidebar.visible;
  }

  get group(): Group {
    if ( this.editorState ) {
      return this.editorState.currentDocument.group;
    }
    return;
  }

  isPanel(currentPanel: ResizePanel): boolean {
    return this.panel === currentPanel;
  }

  isSidebarItemActive(item: DideSidebarItemsLeft | DideSidebarItemsRight): boolean {
    return this.activeSidebar && this.activeSidebar.item === item;
  }

  openSidebar(item: string | number) {
    this.activeSidebar.item = item;
    this.activeSidebar.visible = true;
    this.sidebarClickEmitter.emit(this.activeSidebar);
  }

  clear() {
    this.clearOutput.emit();
  }

  closeSidebar(clicked = true) {
    this.activeSidebar.item = null;
    this.activeSidebar.visible = false;
    if ( clicked ) {
      this.sidebarClickEmitter.emit(this.activeSidebar);
    }
  }

  setSidebarPanel(item: string | number) {
    if (this.activeSidebar.visible && this.activeSidebar.item === item) {
      this.closeSidebar();
    } else {
      this.openSidebar(item);
      if ( item === DideSidebarItemsLeft.PrivateDocument || item === DideSidebarItemsLeft.PublicDocument ) {
        setTimeout(() => {
          this.directoryTree.onNodeClick = this.interceptOnNodeClick.bind(this);
        });
      }
    }
  }

  navigateSidebar(item: string | number) {
    this.activeSidebar.left = this.isPanel(this.panelOpt.Left);
    this.activeSidebar.right = this.isPanel(this.panelOpt.Right);
    this.activeSidebar.bottom = this.isPanel(this.panelOpt.Bottom);
    this.setSidebarPanel(item);
  }

  openFile(document: FileFolder ) {
    if ( document.type === FileType.File ) {
      this.navigationService.openEditor(document._id);
    }
  }

}
