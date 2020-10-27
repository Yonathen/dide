import { NavigationService } from 'src/app/navigation.service';
import { GroupsCollection } from './../../../api/server/collections/groups-collection';
import { Tracker } from 'meteor/tracker';
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
import { DashboardState } from '../navigation.service';
import { ActivatedRoute } from '@angular/router';
import { LoideRoute } from '../shared/enums/loide-route';

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

  public state: DashboardState;

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
  public memberGroups: Group[] = [];
  public requestGroups: Group[] = [];
  public selectedGroup: Group;

  private _subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.state = history.state.data;
    this.loadGroup();

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


    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      let itemIndex = GroupMenuItems.MyGroups;
      if ( util.valueExist(queryParams.get('item')) ) {
        itemIndex = +queryParams.get('item');
      }
      this.selectedMenuItems = this.groupMenuItems[itemIndex];
      this.setActiveMenuItem(itemIndex)
    });

    if ( this.state && this.state.accessSubPage ) {
      this.onClickDashboardItem(this.state.accessSubPage);
    }

    this.trackMembers();

  }

  trackMembers() {
    Tracker.autorun(() => {
      if (Meteor.user()) {
        const memberRequests: Group[] = GroupsCollection.collection.find({
          $and: [ {'members.user._id': {$eq: Meteor.userId()}}, {'createdBy._id': {$ne: Meteor.userId()}} ]
        }).fetch();
        this.loadRequest(memberRequests);
        this.loadMember(memberRequests);
      }
    });
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
        this.loadGroup();
      }
    });
  }

  removeMembership(groupId, user: User = Meteor.user()) {
    this.groupService.removeMember(user, groupId).then(result => {
      if (result.success) {
        this.loadGroup();
      }
    });
  }

  loadGroup(newGroupId?: string) {
    this.groupService.fetchMyGroup().then(result => {
      if (result.success) {
        this.groups = result.returnValue;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadMember(inputGroup: Group[]) {
    this.memberGroups.splice(0, this.memberGroups.length);
    inputGroup.forEach(group => {
      const indexOfMember = group.members.findIndex(member => {
        return member.requestStatus === RequestStatus.Accepted && member.user._id === Meteor.userId();
      });
      if ( indexOfMember >= 0 ) {
        this.memberGroups.push(group);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  loadRequest(inputGroup: Group[]) {
    this.requestGroups.splice(0, this.requestGroups.length);
    inputGroup.forEach(group => {
      const indexOfRequest = group.members.findIndex(member => {
        return member.requestStatus === RequestStatus.Pending && member.user._id === Meteor.userId();
      });
      if ( indexOfRequest >= 0 ) {
        this.requestGroups.push(group);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  onClickSeeGroup(group) {
    this.selectedGroup = group;
    this.viewGroupDialog = true;
  }

  onClickRemoveGroup(group) {
    this.selectedGroup = group;
    this.confirmRemoveGroupDialog = true;
  }

  setActiveMenuItem(meuItemIndex: number | string) {
    if (this.groupMenuItems) {
      this.groupMenuItems.forEach((item, index) => {
        item.active = false;
        if (item.id === meuItemIndex) {
          item.active = true;
          this.selectedMenuItems = item;
        }
      });
    }

    this.changeDetectorRef.detectChanges();
  }

  onClickDashboardItem(event: number | string) {
    const state: DashboardState = { accessSubPage: event};
    this.navigationService.openDashboard(LoideRoute.Group, state);
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
