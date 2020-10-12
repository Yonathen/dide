import { FileFolder, newFileFolder } from './../../api/server/models/file-folder';
import { LoideRoute } from './shared/enums/loide-route';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api/menuitem';
import { Router, ActivatedRoute } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';
import * as _ from 'lodash';

export interface DashboardState {
  accessSubPage?: string | number;
  other?: any;
}

export interface EditorState {
  persistedDocument?: FileFolder;
  currentDocument?: FileFolder;
  changed?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private boardMenuItems = new BehaviorSubject<MenuItem[]>([]);
  private activeEditor = new BehaviorSubject<EditorState>(null);

  constructor(private router: Router, private route: ActivatedRoute) { }

  get editorState(): EditorState {
    return {
      currentDocument: newFileFolder(),
      changed: false
    };
  }

  get menu() {
    return this.boardMenuItems.asObservable();
  }

  get active() {
    return this.activeEditor.asObservable();
  }

  inject(menuItem: MenuItem) {
    const currentMenu = this.boardMenuItems.value;
    const updatedMenu = [...currentMenu, menuItem];
    this.boardMenuItems.next(updatedMenu);
  }

  setEditorState(itemId: string, document: FileFolder) {
    const updatedItems = this.boardMenuItems.value;
    const selectedItem = updatedItems.find( existingItem => existingItem.id === itemId );

    selectedItem.state = this.editorState;
    selectedItem.state.currentDocument = document;
    selectedItem.state.persistedDocument = _.clone(document);
    this.boardMenuItems.next(updatedItems);
    this.activeEditor.next(selectedItem.state);
  }

  closeEditorTab(item: MenuItem) {
    const updatedItems = this.boardMenuItems.value;
    const index = updatedItems.findIndex( updatedItem => updatedItem.id === item.id );
    updatedItems.splice(index, 1);
    this.boardMenuItems.next(updatedItems);
  }

  tabExist(itemId: string): boolean {
    return this.boardMenuItems.value.findIndex(value => value.id === itemId) >= 0;
  }

  documentChanged(itemId: string, changed = true) {
    const updatedItems = this.boardMenuItems.value;
    const selectedItem = updatedItems.find( existingItem => existingItem.id === itemId );

    selectedItem.state.changed = changed;
    this.boardMenuItems.next(updatedItems);
  }

  createNewEditorTab(item: MenuItem) {
    const random = Math.random();
    const newTabId = 'EDITOR_TAB_' + random;
    let file = { name:'new_file', content: '' };
    let newFileMenuItem: MenuItem = {
      id: newTabId,
      icon: 'icon icon-file',
      state: { 'data': file },
      label: file.name
    };
    this.inject(newFileMenuItem);
  }

  openEditor(file: FileFolder) {
    this.router.navigate([LoideRoute.Editor], { relativeTo: this.route, queryParams: { item: file._id }  });
  }

  openDashboard(route: LoideRoute = LoideRoute.Dashboard, stateD?: DashboardState ) {
    this.router.navigate([route], { relativeTo: this.route, state: { data: stateD} });
  }
}
