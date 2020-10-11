import { FileFolder, newFileFolder } from './../../api/server/models/file-folder';
import { LoideRoute } from './shared/enums/loide-route';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api/menuitem';
import { Router, ActivatedRoute } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';

export interface DashboardState {
  accessSubPage?: string | number;
  other?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private boardMenuItems = new BehaviorSubject<MenuItem[]>([]);
  private openedDocument = new BehaviorSubject<FileFolder>(newFileFolder());

  constructor(private router: Router, private route: ActivatedRoute) { }

  get menu() {
    return this.boardMenuItems.asObservable();
  }

  get document() {
    return this.openedDocument.asObservable();
  }

  inject(menuItem: MenuItem) {
    const currentMenu = this.boardMenuItems.value;
    const updatedMenu = [...currentMenu, menuItem];
    this.openedDocument.next(menuItem.state.data);
    this.boardMenuItems.next(updatedMenu);
  }

  closeEditorTab(item: MenuItem) {
    let updatedItems = this.boardMenuItems.value;
    const index = updatedItems.findIndex( updatedItem => updatedItem.id === item.id );
    updatedItems.splice(index, 1);
    this.boardMenuItems.next(updatedItems);
  }

  tabExist(item: MenuItem): boolean {
    return this.boardMenuItems.value.findIndex(value => value.id === item.id) >= 0;
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
