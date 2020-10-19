import { SettingPreference } from 'api/server/models/setting-preference';
import { AccountService } from 'src/app/shared/services/account.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoideRoute } from './shared/enums/loide-route';
import { UserType } from 'api/server/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'loide';
  route: string;

  constructor(
    private translate: TranslateService,
    private accountService: AccountService,
    private location: Location,
    private router: Router) {
    translate.addLangs(['en', 'it']);

    router.events.subscribe((val) => {
      if (location.path() !== ''){
        this.route = location.path();
      }
    });

    this.accountService.getUserPreferences().then(R => {
      this.accountService.trackAccount();
      if (R.success) {
        const preference: SettingPreference = R.returnValue;
        translate.setDefaultLang(preference.language.value);
      }
    });

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
  }

  get isEditor(): boolean {
    return this.route && this.route.indexOf(LoideRoute.Editor) !== -1;
  }
}
