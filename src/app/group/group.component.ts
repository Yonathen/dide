import { util } from 'api/server/lib/util';
import { NotificationType } from './../../../api/server/models/notification';
import { NotifyMessage } from './../shared/model/notify-message';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from './services/group.service';
import { NotificationService } from '../shared/services/notification.service';
import { Group, RequestStatus } from 'api/server/models/group';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { castToNotification, Notification } from 'api/server/models/notification';
import { LoideMenuItem } from '../shared/model/menu-item';
import { User } from 'api/server/models/user';

export enum GroupToolbarMenuItems {
  CreateGroup, RemoveAll
}

export enum GroupMenuItems {
  MyGroups, MemberIn, MemberRequest
}


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  public viewGroupDialog: boolean;
  public createGroupDialog: boolean;
  public manageMemberDialog: boolean;
  public confirmRemoveGroupDialog: boolean;

  public selectedMenuItems: LoideMenuItem;
  public groupMenuItems: LoideMenuItem[];
  public groupToolbar: LoideToolbarMenu;
  public menuLabels: any[];
  public groupMenuItemOpt = GroupMenuItems;

  public groups: Group[];
  public memberGroups: Group[];
  public requestGroups: Group[];
  public selectedGroup: Group;

  private _subscriptions = new Subscription();

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadLists();

    const keys = ['common.group', 'group.see_group', 'group.remove_group', 'common.member', 'group.update_group',
      'group.add_member', 'group.remove_member', 'group.exit_group', 'group.accept_membership'];
    const translationSubscription = this.translateService.stream(keys).pipe(
      tap(translations => {
        this.menuLabels = translations;
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
    this._subscriptions.add(translationSubscription);

    const toolbarButtonMenu  = [
      {id: GroupToolbarMenuItems.CreateGroup, class: 'btn btn-success', iconClass: 'icon icon-group_add', labelIndex: 'group.create_group'}
    ];

    this.groupToolbar = {
      enableButtonMenu: true,
      enableSort: true,
      buttonMenu: toolbarButtonMenu
    };

    this.groupMenuItems = [
      {id: GroupMenuItems.MyGroups, iconClass: 'icon-supervised_user_circle', labelIndex: 'group.my_group', active: true},
      {id: GroupMenuItems.MemberIn, iconClass: 'icon-group', labelIndex: 'group.member_in', active: false},
      {id: GroupMenuItems.MemberRequest, iconClass: 'icon-group_add', labelIndex: 'group.member_request', active: false}
    ];
    this.selectedMenuItems = this.groupMenuItems[0];
  }

  isSelectedMenu(itemId: number | string): boolean {
    return util.valueExist(this.selectedMenuItems) && itemId === this.selectedMenuItems.id;
  }

  getMenuItems(group: Group, user?: User): MenuItem[] {
    const result: MenuItem[] = [{
      label: this.menuLabels['common.group'],
      items: [
          {
            label: this.menuLabels['group.see_group'],
            icon: 'icon icon-see_group',
            command: () => this.onClickSeeGroup(group)
          }
      ]
    }];

    if ( this.selectedMenuItems.id === GroupMenuItems.MyGroups ) {
      result[0].items.push({
        label: this.menuLabels['group.update_group'],
        icon: 'icon icon-update',
        command: () => this.openMemberManagementDialog(group)
      }, {
        icon: 'icon icon-delete',
        label: this.menuLabels['group.remove_group'],
        command: () => this.onClickRemoveGroup(group)
      });

    } else if ( this.selectedMenuItems.id === GroupMenuItems.MemberIn ) {
      result[0].items.push({
        icon: 'icon  icon-remove_member',
        label: this.menuLabels['group.exit_group'],
        command: () => {
          this.removeMembership(group._id);
        }
      });
    } else if ( this.selectedMenuItems.id === GroupMenuItems.MemberRequest ) {
      result[0].items.push({
        icon: 'icon icon-member_add',
        label: this.menuLabels['group.accept_membership'],
        command: () => {
          this.acceptMembership(group._id);
        }
      });
    }
    return result;
  }

  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  openMemberManagementDialog(group: Group) {
    this.selectedGroup = group;
    this.manageMemberDialog = true;
  }

  acceptMembership(groupId) {
    this.groupService.acceptMembership(groupId).then(result => {
      if (result.success) {
        this.loadLists();
      }
    });
  }

  removeMembership(groupId, user: User = Meteor.user()) {
    this.groupService.removeMember(user, groupId).then(result => {
      if (result.success) {
        this.loadLists();
      }
    });
  }

  loadLists() {
    this.loadGroup();
    this.loadMember();
    this.loadRequest();
  }

  loadGroup(newGroupId?: string) {
    this.groupService.fetchMyGroup().then(result => {
      if (result.success) {
        this.groups = result.returnValue;

        if (newGroupId) {
          const index = this.groups.findIndex(group => group._id = newGroupId);
          this.sendMemberRequest(index);
        }

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadMember() {
    this.groupService.fetchMemberGroup().then(result => {
      if (result.success) {
        this.memberGroups = result.returnValue;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadRequest() {
    this.groupService.fetchMemberGroup(RequestStatus.Pending).then(result => {
      if (result.success) {
        this.requestGroups = result.returnValue;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  sendMemberRequest(index: number) {
    const selected: Group = this.groups[index];
    selected.members.forEach(member => {
      const notification: Notification = castToNotification(
        'Group membership request',
        'You have membership request for group ' + selected.name,
        member.user, NotificationType.GroupRequest, selected
      );
      this.notificationService.notifyUser(notification);
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


  onClickDashboardItem(event: number | string) {
    this.groupMenuItems.forEach((item, index) => {
      item.active = false;
      if (item.id === event) {
        item.active = true;
        this.selectedMenuItems = item;
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  onClickToolbarButton(event: number | string) {
    this.createGroupDialog = true;
  }

  onUpdateCancel(updated: any) {
    if (updated) {
      this.loadGroup();
    }
    this.selectedGroup = null;
    this.manageMemberDialog = false;
  }

  onCreateCancel(created: string | null) {
    if (created) {
      this.loadGroup(created);
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
