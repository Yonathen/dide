import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Notification, NotificationStatus } from 'api/server/models/notification';
import { NotificationService } from '../../services/notification.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [MessageService]
})
export class NotificationsComponent implements OnInit {

  @Input() notifications: Notification[] = [];
  @Output('onNotificationChange') notificationChangeEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(private notificationService: NotificationService,
    private translateSevice: TranslateService,
    private changeDetectionRef: ChangeDetectorRef,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  removeNotification(notificationId: string) {
    this.notificationService.remove(notificationId).then(result => {
      if (result.success) {
        this.messageService.add({
          key: 'removedToast', severity:'success', 
          summary: this.translateSevice.instant('notification.success_remove_title'), 
          detail: ''
        });
        this.notificationChangeEmitter.emit();
      }
    })
  }
  markNotificationAsSeen(notificationId: string) {
    this.notificationService.markAsSeen(notificationId).then(result => {
      if (result.success) {
        this.messageService.add({
          key: 'markAsToast', severity:'success', 
          summary: this.translateSevice.instant('notification.success_marked_title'), 
          detail: ''
        });
        this.notificationChangeEmitter.emit();
      }
    })
  }

  isNotificationNew(notification: Notification): boolean {
    return notification.status === NotificationStatus.New;
  }

}
