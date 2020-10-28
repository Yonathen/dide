import { util } from 'api/server/lib/util';
import { response } from './../../api/server/lib/response';
import { SettingPreference } from 'api/server/models/setting-preference';
import { AccountService } from 'src/app/shared/services/account.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DideRoute } from './shared/enums/dide-route';
import { UserType } from 'api/server/models/user';
import { WebsocketService } from './shared/services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dide';
  route: string;

  constructor(
    private translate: TranslateService,
    private accountService: AccountService,
    private location: Location,
    private router: Router) {

      const browserLang = translate.getBrowserLang();
      translate.addLangs(['en', 'it']);
      translate.setDefaultLang(browserLang.match(/en|fr/) ? browserLang : 'en');

      router.events.subscribe((val) => {
        if (location.path() !== ''){
          this.route = location.path();
        }
      });

      this.accountService.preference.subscribe(P => {
        if ( util.valueExist(P)) {
          translate.use(P.language.value);
        }
      });

      this.accountService.getUserPreferences().then(R => {
        this.accountService.trackAccount();
      });
  }

  ngOnInit() {
  }

  get isEditor(): boolean {
    return this.route && this.route.indexOf(DideRoute.Editor) !== -1;
  }
}
