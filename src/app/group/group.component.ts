import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from './services/group.service';
import { NotificationService } from '../shared/services/notification.service';
import { Group } from 'api/server/models/group';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum GroupToolbarMenuItems {
  CreateGroup, RemoveAll
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  public viewGroupDialog: boolean;
  public createGroupDialog: boolean;
  public confirmRemoveGroupDialog: boolean;

  public groupToolbar: LoideToolbarMenu;
  public menuLabels: any[];

  public groups: Group[];
  public selectedGroup: Group;

  private _subscriptions = new Subscription();

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadGroup();

    const keys = ['common.group', 'group.see_group', 'group.remove_group', 'common.member', 'group.add_member', 'group.remove_member'];
    const translationSubscription = this.translateService.stream(keys).pipe(
      tap(translations => {
        this.menuLabels = translations;
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
    this._subscriptions.add(translationSubscription);

    const toolbarButtonMenu  = [
      {id: GroupToolbarMenuItems.CreateGroup, class: 'btn btn-success', iconClass: 'icon icon-group_add', labelIndex: 'group.create_group'},
      {id: GroupToolbarMenuItems.RemoveAll, class: 'btn btn-danger', iconClass: 'icon icon-delete', labelIndex: 'common.remove_all'}
    ];

    this.groupToolbar = {
      enableButtonMenu: true,
      enableSort: true,
      buttonMenu: toolbarButtonMenu
    };
  }

  getMenuItems(group: Group): MenuItem[] {
    return [{
      label: this.menuLabels['common.group'],
      items: [
          {label: this.menuLabels['group.see_group'], icon: 'icon icon-see_group', command: () => this.onClickSeeGroup(group)},
          {label: this.menuLabels['group.remove_group'], icon: 'icon icon-delete', command: () => this.onClickRemoveGroup(group)}
      ]
    },
    {
      label: this.menuLabels['common.member'],
      items: [
          {label: this.menuLabels['group.add_member'], icon: 'icon icon-member_add'},
          {label: this.menuLabels['group.remove_member'], icon: 'icon icon-remove_member'},
      ]
    }
    ];
  }

  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  loadGroup() {
    this.groupService.fetchGroup().then(result => {
      if (result.success) {
        this.groups = result.returnValue;
      }
    });
  }

  onClickSeeGroup(group) {
    this.selectedGroup = group;
    this.viewGroupDialog = true;
  }

  onClickRemoveGroup(group) {
    this.selectedGroup = group;
    this.confirmRemoveGroupDialog = true;
  }

  onClickToolbarButton(event: number | string) {
    this.createGroupDialog = true;
  }

  onCreateCancel(created: boolean) {
    if (created) {
      this.loadGroup();
    }
    this.createGroupDialog = false;
  }

  removeGroup() {
    this.groupService.removeGroup(this.selectedGroup._id).then(result => {
      if (result.success) {
        this.loadGroup();
        this.confirmRemoveGroupDialog = false;
      }
    });
  }

  cancelRemoveGroup() {
    this.selectedGroup = null;
    this.confirmRemoveGroupDialog = false;
  }

}
