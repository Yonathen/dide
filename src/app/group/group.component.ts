import { Component, OnInit } from '@angular/core';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export enum GroupToolbarMenuItems {
  CreateGroup, RemoveAll
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  public groupToolbar: LoideToolbarMenu;
  public gridItemMenu: MenuItem[];

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {

    this.gridItemMenu = [{
      label: 'Group',
      items: [
          {label: this.translateService.instant('group.see_group'), icon: 'icon icon-see_group'},
          {label: this.translateService.instant('group.remove_group'), icon: 'icon icon-delete'}
      ]
    },
    {
      label: 'Member',
      items: [
          {label: this.translateService.instant('group.add_member'), icon: 'icon icon-member_add'},
          {label: this.translateService.instant('group.remove_member'), icon: 'icon icon-remove_member'},
      ]
    }
    ];

    let toolbarButtonMenu  = [
      {id: GroupToolbarMenuItems.CreateGroup, class:'btn btn-success', iconClass: 'icon icon-group_add', labelIndex: 'group.create_group'},
      {id: GroupToolbarMenuItems.RemoveAll, class:'btn btn-danger', iconClass: 'icon icon-delete', labelIndex: 'common.remove_all'}
    ];

    this.groupToolbar = {
      enableButtonMenu: true,
      enableSort: true,
      buttonMenu: toolbarButtonMenu
    }
  }

}
