import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoideSidebarItemsLeft, LoideSidebarItemsRight } from '../../enums/loide-sidebar-items.enum';
import { EventSidebar } from '../../model/event-sidebar'
import { LoideMenuItem } from 'src/app/shared/model/menu-item';

@Component({
  selector: 'app-editor-sidebar',
  templateUrl: './editor-sidebar.component.html',
  styleUrls: ['./editor-sidebar.component.scss']
})
export class EditorSidebarComponent implements OnInit, OnChanges {

  @Input() positionRight: boolean = false;
  @Input() openByResize: boolean = false;

  public sidebarLeft = LoideSidebarItemsLeft;
  public sidebarRight = LoideSidebarItemsRight;
  public sidebarMenuItems: LoideMenuItem[];
  public activeSidebar: EventSidebar = {} as EventSidebar;

  @Output('onClickSidebar') sidebarClickEmitter: EventEmitter<EventSidebar> = new EventEmitter<EventSidebar>();

  constructor() { }

  ngOnInit(): void {
    if (!this.isPositionRight()) {
      this.sidebarMenuItems = [
        { id: LoideSidebarItemsLeft.PublicDocument, iconClass: 'icon-document-public', labelIndex: 'document.public_document'},
        { id: LoideSidebarItemsLeft.PrivateDocument, iconClass: 'icon-folder_shared', labelIndex: 'document.private_document'}
      ];
    } else {

      this.sidebarMenuItems = [
        { id: LoideSidebarItemsRight.Language, iconClass: 'icon-translate', labelIndex: 'preference.language'},
        { id: LoideSidebarItemsRight.Group, iconClass: 'icon-group', labelIndex: 'common.group'},
        { id: LoideSidebarItemsRight.Appearance, iconClass: 'icon-appearance', labelIndex: 'preference.appearance'},
        { id: LoideSidebarItemsRight.Solver, iconClass: 'icon-new-tab', labelIndex: 'preference.solver'},
        { id: LoideSidebarItemsRight.Filter, iconClass: 'icon-filter_list_alt', labelIndex: 'editor.filter'}
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes && changes.openByResize ) {
      if ( this.openByResize ) {
        this.openSidebar(this.sidebarMenuItems[0].id);
      } else {
        this.closeSidebar(false);
      }
    }
  }

  get isSidebarLeftOpen(): boolean {
    return this.activeSidebar && this.activeSidebar.visible;
  }

  isPositionRight(): boolean {
    return this.positionRight;
  }

  isSidebarItemActive(item: LoideSidebarItemsLeft | LoideSidebarItemsRight): boolean {
    return this.activeSidebar && this.activeSidebar.item === item;
  }

  openSidebar(item: string | number) {
    this.activeSidebar.item = item;
    this.activeSidebar.visible = true;
    this.sidebarClickEmitter.emit(this.activeSidebar);
  }

  closeSidebar(clicked = true) {
    this.activeSidebar.item = null;
    this.activeSidebar.visible = false;
    if ( clicked ) {
      this.sidebarClickEmitter.emit(this.activeSidebar);
    }
  }

  setSidebarPanel(item:  LoideSidebarItemsLeft | LoideSidebarItemsRight) {
    if (this.activeSidebar.visible && this.activeSidebar.item === item) {
      this.closeSidebar();
    } else {
      this.openSidebar(item);
    }
  }

  navigateSidebar(item: LoideSidebarItemsLeft | LoideSidebarItemsRight) {
    this.activeSidebar.left = !this.isPositionRight();
    this.activeSidebar.right = this.isPositionRight();
    this.setSidebarPanel(item);
  }

}
