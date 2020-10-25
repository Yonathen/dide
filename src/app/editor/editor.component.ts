import { RequestExecutor } from './../shared/model/executor';
import { SettingPreference } from './../../../api/server/models/setting-preference';
import { AccountService } from './../shared/services/account.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { SocketioService } from './../shared/services/socketio.service';
import { EditorState } from './../navigation.service';
import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { EventSidebar } from './model/event-sidebar';
import { ScriptLoaderService } from './services/script-loader.service';
import { NavigationService } from 'src/app/navigation.service';
import { MenuItem, TreeNode, MessageService } from 'primeng/api';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../documents/services/document.service';
import { FileFolder, FileType, AccessType } from 'api/server/models/file-folder';
import { LoideRoute } from '../shared/enums/loide-route';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoideToolbarItems } from './enums/loide-toolbar-items.enum';
import { util } from 'api/server/lib/util';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WebsocketService } from '../shared/services/websocket.service';
import { EditorToolbarEvent } from './components/editor-toolbar/editor-toolbar.component';
import { TranslateService } from '@ngx-translate/core';

export const EditorTabTag = 'EDITOR_TAB_';

export enum ResizePanel {
  Left = 'Left',
  Right = 'Right',
  Bottom = 'Bottom',
  None = 'None'
}

interface MousePosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [MessageService]
})
export class EditorComponent implements OnInit {
  public loggedUserId: string;
  public content: any;
  public sidebarEvent: EventSidebar;
  public sidebarLeft: boolean;
  public sidebarRight: boolean;
  public editorState: EditorState;
  public documentChanged: boolean;
  public editorMenuItems: MenuItem[] = [];

  public heightBody: number;
  public widthBody: number;
  public widthBarLeft: number = 40;
  public widthBarRight: number = 40;
  public heightBarBottom: number = 24;

  public mouse: MousePosition = { x : 0, y : 0};
  public activeResize: ResizePanel = ResizePanel.None;
  public resizeOpt = ResizePanel;
  public openSidebarLeftByResize: boolean = false;
  public openSidebarRightByResize: boolean = false;
  public openSidebarBottomByResize: boolean = false;

  public breadcrumbItems: MenuItem[] = [];
  public publicDocuments: TreeNode[] = [];
  public privateDocuments: TreeNode[] = [];

  public preference: SettingPreference;
  public webSocketSubject: WebSocketSubject<any>;
  public executorConnected: boolean;

  public outputEvent: Subject<void> = new Subject<void>();

  @ViewChild('editorWrap') editorWrap: ElementRef;

  @ViewChild('editor', { static: true }) editor: AceEditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private documentService: DocumentService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private navigationService: NavigationService,
    private websocketService: WebsocketService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private scriptLoaderService: ScriptLoaderService) {}

  public get winHeight() {
    return window.innerHeight;
  }

  public get winWidth() {
    return window.innerWidth;
  }

  get sidebarLeftVisible(): boolean {
    return this.sidebarLeft;
  }

  get sidebarRightVisible(): boolean {
    return this.sidebarRight;
  }

  ngOnInit(): void {
    this.loggedUserId = Meteor.userId();
    this.loadPrivateDocument();
    this.loadPublicDocument();
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
      if ( util.valueExist(activeState)) {
        this.editorState = activeState;


        this.webSocketSubject = this.websocketService.create();
        this.webSocketSubject.subscribe(
          R => {
            console.log(R);
            this.executorConnected = true;
            if (R.model !== 'Running..'){
              this.editorState.output.push(R);
              this.outputEvent.next();
            }
          },
          E => {
            console.log(E);
            this.executorConnected = false;
            this.messageService.add({
              key: 'executeToast', severity: 'warn', sticky: true, closable: false,
              summary: '',
              detail: this.translateService.instant('editor.warn_connect_detail')});
          }
        );
      }
    });

    this.accountService.preference.subscribe(R => {
      this.preference = R;
    });
    this.setBodyWidth();
    this.setBodyHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setBodyWidth();
    this.setBodyHeight();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    switch (this.activeResize) {
      case ResizePanel.Left:
        this.resizeLeft();
        break;
      case ResizePanel.Right:
        this.resizeRight();
        break;
      case ResizePanel.Bottom:
        this.resizeBottom();
    }
  }

  isDocumentFolder(document: FileFolder) {
    return document.type === FileType.Folder;
  }

  isOwner(document: FileFolder): boolean {
    return document.owner._id === this.loggedUserId;
  }

  isInGroup(document: FileFolder): boolean {
    if (!util.valueExist(document.group) ||
      !util.valueExist(document.group.members)) {
        return false;
      }
    const loggedUserIndex = document.group.members.findIndex(elt => elt.user._id === this.loggedUserId);
    return loggedUserIndex >= 0;
  }

  hasAccess(document: FileFolder, accessType: AccessType): boolean {
    const writeAccess: number[] = [2, 3, 6, 7];
    const readAccess: number[] = [4, 5, 6, 7];
    const executeAccess: number[] = [1, 3, 5, 7];

    let userAccess: number = document.memberAccess.other;
    if ( this.isOwner(document) ) {
      userAccess = document.memberAccess.owner;
    } else if ( this.isInGroup(document) ) {
      userAccess = document.memberAccess.group;
    }

    switch (accessType) {
      case AccessType.Write:
        return writeAccess.includes(userAccess);
      case AccessType.Read:
        return readAccess.includes(userAccess);
      case AccessType.Execute:
        return executeAccess.includes(userAccess);
    }

    return false;
  }

  loadPublicDocument() {
    this.documentService.fetchPublicDocuments().then(result => {
      if ( result.success && result.returnValue) {
        const returnValue: TreeNode[] = result.returnValue;
        this.publicDocuments.splice(0, this.publicDocuments.length);
        returnValue.forEach( elt => {
          if ( this.hasAccess(elt.data, AccessType.Read) ) {
            this.publicDocuments.push(elt);
          }
        });
      }
    });
  }

  loadPrivateDocument() {
    this.documentService.fetchPrivateDocuments().then(result => {
      if (result.success) {
        this.privateDocuments = result.returnValue;
      }
    });
  }

  setResizePanel(event: MouseEvent, resizePanel: ResizePanel) {
    event.stopPropagation();
    this.activeResize = resizePanel;
  }

  setBodyWidth() {
    this.widthBody = this.winWidth - this.widthBarLeft - this.widthBarRight - 20;
  }

  setBodyHeight() {
    this.heightBody = this.winHeight - this.heightBarBottom - 85;
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

  onToolbarEvent($event: EditorToolbarEvent) {
    switch ($event.menuItem) {
      case LoideToolbarItems.TabForward:
        this.loadTabForward();
        break;
      case LoideToolbarItems.TabBackward:
        this.loadTabBackward();
        break;
      case LoideToolbarItems.SaveFile:
        this.saveDocument();
        break;
      case LoideToolbarItems.ExecuteFile:
        this.executeDocument();
    }
  }

  clear() {
    this.editorState.output.splice(0, this.editorState.output.length);
  }

  toggleSidebarLeft($event: EventSidebar) {
    this.sidebarEvent = $event;

    if (this.sidebarEvent.left) {
      this.widthBarLeft = this.sidebarEvent.visible ? 240 : 40;
    } else if (this.sidebarEvent.right) {
      this.widthBarRight = this.sidebarEvent.visible ? 240 : 40;
    } else if ( this.sidebarEvent.bottom) {
      this.heightBarBottom = this.sidebarEvent.visible ? 240 : 24;
    }

    if ( this.sidebarEvent.left || this.sidebarEvent.right ) {
      this.setBodyWidth();
    } else if ( this.sidebarEvent.bottom ) {
      this.setBodyHeight();
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

  executeDocument() {
    if ( this.executorConnected ) {
      const requestExecutor: RequestExecutor = {
        language: this.preference.programingLanguage.value,
        engine: this.preference.solver.value,
        option: [],
        program: [this.editorState.currentDocument.content]
      };

      this.webSocketSubject.next(requestExecutor);
    }
  }

  loadTabBackward() {
    if ( this.editorState ) {
      const activeIndex = this.editorMenuItems.findIndex(item => item.state.currentDocument._id === this.editorState.currentDocument._id);
      if ( activeIndex > 0 ) {
        const prevItem = this.editorMenuItems[activeIndex - 1];
        this.navigationService.openEditor(prevItem.state.currentDocument._id);
      }
    }
  }

  loadTabForward() {
    if ( this.editorState ) {
      const activeIndex = this.editorMenuItems.findIndex(item => item.state.currentDocument._id === this.editorState.currentDocument._id);
      if ( activeIndex < this.editorMenuItems.length - 1 ) {
        const nextItem = this.editorMenuItems[activeIndex + 1];
        this.navigationService.openEditor(nextItem.state.currentDocument._id);
      }
    }
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

  resizeLeft() {
    if ( this.mouse.x > 40) {
      this.widthBarLeft = this.mouse.x;
      this.setBodyWidth();

      if ( this.mouse.x >= 60 ) {
        this.openSidebarLeftByResize = true;
      } else {
        this.openSidebarLeftByResize = false;
      }
    } else {
      this.openSidebarLeftByResize = false;
    }
  }

  resizeRight() {
    const rightX = this.winWidth - this.mouse.x;
    if ( rightX > 40) {
      this.widthBarRight = rightX;
      this.setBodyWidth();

      if ( rightX >= 60 ) {
        this.openSidebarRightByResize = true;
      } else {
        this.openSidebarRightByResize = false;
      }
    } else {
      this.openSidebarRightByResize = false;
    }
  }

  resizeBottom() {
    const bottomY = this.winHeight - this.mouse.y;
    if ( bottomY > 24) {
      this.heightBarBottom = bottomY;
      this.setBodyHeight();
      this.openSidebarBottomByResize = true;
    } else {
      this.openSidebarBottomByResize = false;
    }
  }

}
