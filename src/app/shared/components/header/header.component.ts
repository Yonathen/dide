import { NavigationService } from 'src/app/navigation.service';
import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';

import { LoideRoute } from '../../enums/loide-route';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Profile, User } from 'api/server/models/user';
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
    return this.route && this.route.indexOf(LoideRoute.Editor) !== -1;
  }

  get isLogedIn(): boolean {
    return util.valueExist(Meteor.user());
  }

  constructor(
    public router: Router,
    private ngZone: NgZone,
    private translateService: TranslateService,
    private changeDetectionRef: ChangeDetectorRef,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(user => {
      if (user && user._id) {
        this.setUserAccount(user);
        this.loadNotification();
        this.changeDetectionRef.detectChanges();
      } else {
        this.userAccount = null;
      }
    });
  }

  loadNotification() {
    this.notificationService.fetchNotification().then( result => {
      if ( result.success ) {
        this.notifications = result.returnValue;
      }
    });
  }

  setUserAccount(user: User) {
    if ( util.valueExist(user) ) {
      this.userAccount = {
        email: user.emails && user.emails.length > 0 ? user.emails[0].address : null,
        profile: user.profile
      } as UserAccount;
    }
  }

  goToDashboard() {
    this.router.navigate( [LoideRoute.Dashboard]);
  }


  openCreateAccountDialog() {
    this.createAccountDialog = true;
  }

  openAccessAccountDialog() {
    this.accessAccountDialog = true;
  }

  logout() {
    this.ngZone.run(() => {
      this.accountService.exitAccount().then((result) => {
        if ( result.success ) {
          this.navigationService.openDashboard();
          this.changeDetectionRef.detectChanges();
        }
      });
    });
  }

  onCancelCreate(created: boolean) {
    this.createAccountDialog = false;
    if (created) {
      this.messageService.add({key: 'createdToast', severity:'success',
        summary: this.translateService.instant('account.success_create_title'),
        detail: this.translateService.instant('account.success_create_detail')});
    }
  }

  onCancelAccess(logedIn: boolean) {
    this.accessAccountDialog = false;
  }

}
