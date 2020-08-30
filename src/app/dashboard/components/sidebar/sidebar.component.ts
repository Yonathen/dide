import { User, UserType } from 'api/server/models/user';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { util } from 'api/server/lib/util';

export interface LoideSidebarMenuItem {
  routerLink?: string;
  active?: boolean;
  icon?: string;
  label?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: User;
  public sideMenuItems: LoideSidebarMenuItem[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(user => {
      if (user && user._id) {
        this.user = user;
      } else {
        this.user = null;
      }

      this.setSideMenuItems();
    });
  }

  setSideMenuItems() {
    this.sideMenuItems.splice(0, this.sideMenuItems.length);
    this.sideMenuItems.push({ routerLink: 'documents', active: true, icon: 'icon-folder', label: 'common.documents' });
    if ( util.valueExist(this.user) ) {
      this.sideMenuItems.push({ routerLink: 'group', active: false, icon: 'icon-group', label: 'common.group' });
      if ( this.user.profile.type === UserType.Member ) {
        this.sideMenuItems.push({ routerLink: 'preferences', active: false, icon: 'icon-settings', label: 'common.preferences' });
      } else if ( this.user.profile.type === UserType.Admin ) {
        this.sideMenuItems.push({ routerLink: 'admin', active: false, icon: 'icon-settings', label: 'common.preferences' });
      }
      this.sideMenuItems.push({ routerLink: 'archive', active: false, icon: 'icon-archive', label: 'common.archive' });
      this.sideMenuItems.push({ routerLink: 'trash', active: false, icon: 'icon-delete', label: 'common.trash' });
    }
  }

}
