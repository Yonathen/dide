import { LoideRoute } from './shared/enums/loide-route';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api/menuitem';
import { Router, ActivatedRoute } from '@angular/router';

export interface DashboardState {
  accessSubPage?: string | number;
  other?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private boardMenuItems = new BehaviorSubject<MenuItem[]>([]);

  constructor(private router: Router, private route: ActivatedRoute) { }

  get menu() {
    return this.boardMenuItems.asObservable();
  }

  inject(menuItem: MenuItem) {
    const currentMenu = this.boardMenuItems.value;
    const updatedMenu = [...currentMenu, menuItem];
    this.boardMenuItems.next(updatedMenu);
  }

  closeEditorTab(item: MenuItem) {
    let updatedItems = this.boardMenuItems.value;
    const index = updatedItems.findIndex( updatedItem => updatedItem.id === item.id );

    updatedItems.splice(index, 1);
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

  openEditor(file: any) {
    const random = Math.random();
    const newTabId = 'EDITOR_TAB_' + random;
    let fileMenuItem: MenuItem = {
      id: newTabId,
      icon: 'icon icon-file',
      state: { 'data': file },
      label: file.name
    };
    const indexOfProfile = this.boardMenuItems.value.findIndex(item => item.id === newTabId);
    if ( indexOfProfile === -1 ) {
      this.inject(fileMenuItem);
    }
    this.router.navigate([LoideRoute.Editor], { relativeTo: this.route, state: fileMenuItem.state });
  }

  openDashboard(route: LoideRoute = LoideRoute.Dashboard, stateD?: DashboardState ) {
    this.router.navigate([route], { relativeTo: this.route, state: { data: stateD} });
  }
}
