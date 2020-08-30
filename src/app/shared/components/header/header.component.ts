import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { LoideRoute } from '../../enums/loide-route';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from 'api/server/models/user';
import { util } from 'api/server/lib/util';
import { UserAccount } from 'api/server/models/user-account';
import { Tracker } from 'meteor/tracker';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from 'api/server/models/notification';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MessageService]
})
export class HeaderComponent implements OnInit {

  @Input() route: string;
  notifySidebar: boolean;

  public createAccountDialog: boolean;
  public accessAccountDialog: boolean;
  public userAccount: UserAccount;
  public notifications: Notification[];

  get isEditor(): boolean {
    return this.route === LoideRoute.Editor;
  }

  get isLogedIn(): boolean {
    return util.valueExist(Meteor.user());
  }

  constructor(public router: Router,
    private translateSevice: TranslateService,
    private changeDetectionRef: ChangeDetectorRef,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    Tracker.autorun(() => {
      if (Meteor.user()) {
        this.setUserAccount();
        this.loadNotification();
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  loadNotification() {
    this.notificationService.fetchNotification().then( result => {
      if ( result.success ) {
        this.notifications = result.returnValue;
        console.log(this.notifications);
      }
    });
  }

  setUserAccount() {
    const user = Meteor.user();
    if ( util.valueExist(user) ) {
      this.userAccount = {} as UserAccount;
      this.userAccount.email = user.emails && user.emails.length > 0 ? user.emails[0].address : null;
      this.userAccount.profile = user.profile;
    }
  }

  goToDashboard() {
    this.router.navigate( [LoideRoute.Documents]);
  }


  openCreateAccountDialog() {
    this.createAccountDialog = true;
  }

  openAccessAccountDialog() {
    this.accessAccountDialog = true;
  }

  logout() {
    this.accountService.exitAccount().then((result) => {
      if ( result.success ) {
        this.goToDashboard();
        this.changeDetectionRef.detectChanges();
      }
    })
  }

  onCancelCreate(created: boolean) {
    this.createAccountDialog = false;
    if (created) {
      this.messageService.add({key: 'createdToast', severity:'success',
        summary: this.translateSevice.instant('account.success_create_title'),
        detail: this.translateSevice.instant('account.success_create_detail')});
    }
  }

  onCancelAccess(logedIn: boolean) {
    this.accessAccountDialog = false;
    if (logedIn) {
      this.setUserAccount();
    }
  }

}
