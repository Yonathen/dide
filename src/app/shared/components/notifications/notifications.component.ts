import { NavigationService, DashboardState } from './../../../navigation.service';
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Notification, NotificationStatus, NotificationType } from 'api/server/models/notification';
import { NotificationService } from '../../services/notification.service';
import { MessageService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LoideRoute } from '../../enums/loide-route';
import { GroupMenuItems } from 'src/app/group/group.component';
import { Group } from 'api/server/models/group';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [MessageService]
})
export class NotificationsComponent implements OnInit, OnDestroy {

  @Input() notifications: Notification[] = [];
  @Output('onNotificationChange') notificationChangeEmitter: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions = new Subscription();
  public menuLabels: any[];

  constructor(
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService) { }

  ngOnInit(): void {
    const keys = ['notification.open_request', 'common.mark_seen', 'common.remove'];
    const translationSubscription = this.translateService.stream(keys).pipe(
      tap(translations => {
        this.menuLabels = translations;
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
    this.subscriptions.add(translationSubscription);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  removeNotification(notificationId: string) {
    this.notificationService.remove(notificationId).then(result => {
      if (result.success) {
        this.messageService.add({
          key: 'removedToast', severity:'success',
          summary: this.translateService.instant('notification.success_remove_title'),
          detail: ''
        });
      }
    });
  }
  markNotificationAsSeen(notificationId: string) {
    this.notificationService.markAsSeen(notificationId).then(result => {
      if (result.success) {
        this.messageService.add({
          key: 'markAsToast', severity: 'success',
          summary: this.translateService.instant('notification.success_marked_title'),
          detail: ''
        });
      }
    });
  }

  isNotificationNew(notification: Notification): boolean {
    return notification.status === NotificationStatus.New;
  }

  getMenuItems(notification: Notification): MenuItem[] {
    const result: MenuItem[] = [];
    switch (notification.type) {
      case NotificationType.GroupRequest:
        result.push({
          label: this.menuLabels['notification.open_request'], icon: 'icon icon-remove_red_eye',
          command: () => this.openRequest(notification.related)
        });
        if (notification.status === NotificationStatus.New) {
          result.push({
            label: this.menuLabels['common.mark_seen'], icon: 'icon icon-supervised_user_circle',
            command: () => this.markNotificationAsSeen(notification._id)
          });
        }
        result.push({
            label: this.menuLabels['common.remove'], icon: 'icon icon-delete',
              command: () => this.removeNotification(notification._id)
          });
        break;
    }
    return result;
  }

  openRequest(group?: Group) {
    const state: DashboardState = { accessSubPage: GroupMenuItems.MemberRequest, other: group };
    this.navigationService.openDashboard(LoideRoute.Group, state);
  }

}
