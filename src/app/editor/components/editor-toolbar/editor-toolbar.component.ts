import { EditorComponent } from './../../editor.component';
import { User } from './../../../../../api/server/models/user';
import { NavigationService, EditorState } from './../../../navigation.service';
import { util } from './../../../../../api/server/lib/util';
import { LoideToolbarItems } from './../../enums/loide-toolbar-items.enum';
import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Access, FileFolder, memberHasAccess, allHasAccess } from 'api/server/models/file-folder';

export interface EditorToolbarEvent {
  menuItem: LoideToolbarItems;
  data?: any;
}

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent implements OnInit {

  toolbarEvent = LoideToolbarItems;
  public editorMenuItems: MenuItem[] = [];
  public editorState: EditorState;

  @Input() executorConnected: boolean;
  @Output() toolbarClicked: EventEmitter<EditorToolbarEvent> = new EventEmitter<EditorToolbarEvent>();
  constructor(
    private parent: EditorComponent,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.navigationService.menu.subscribe( menuItems => {
      this.editorMenuItems.splice(0, this.editorMenuItems.length);
      menuItems.forEach(item => {
        this.editorMenuItems.push(item);
      });
    });

    this.navigationService.active.subscribe(activeState => {
      if ( util.valueExist(activeState)) {
        this.editorState = activeState;
      }
    });

  }

  emitToolbarClick(action: LoideToolbarItems, data?: any) {
    const toolbarEvent: EditorToolbarEvent = { menuItem: action };
    if ( util.valueExist(data) ) {
      toolbarEvent.data = data;
    }
    this.toolbarClicked.emit(toolbarEvent);
  }

  enableBackward(): boolean {
    if ( this.editorState && this.editorMenuItems ) {
      const activeIndex = this.editorMenuItems.findIndex(item => item.state.currentDocument._id === this.editorState.currentDocument._id);
      return activeIndex > 0;
    }
    return false;
  }

  enableForward(): boolean {
    if ( this.editorState && this.editorMenuItems ) {
      const activeIndex = this.editorMenuItems.findIndex(item => item.state.currentDocument._id === this.editorState.currentDocument._id);
      return activeIndex < this.editorMenuItems.length - 1;
    }
    return false;
  }

  enableExecutor(): boolean {
    return this.executorConnected;
  }

  enableUndo(): boolean {
    return this.parent.undoEnabled;
  }

  enableRedo(): boolean {
    return this.parent.redoEnabled;
  }

  enableDownload(): boolean {
    return util.valueExist(this.editorState);
  }

  enableSave(): boolean {
    if (  this.editorState && this.editorState.changed ) {
      const userId = Meteor.userId();
      const document: FileFolder = this.editorState.currentDocument;
      const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
      return ( userId === document.owner._id ||
        memberHasAccess(userId, accesses, document) ||
        allHasAccess(accesses, document));
    }
    return false;
  }

  showDropdownNav() {
    return ( util.valueExist(this.editorMenuItems) && this.editorMenuItems.length > 1);
  }

}
