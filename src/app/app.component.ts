import { AccountService } from 'src/app/shared/services/account.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoideRoute } from './shared/enums/loide-route';

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
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    router.events.subscribe((val) => {
      if (location.path() !== ''){
        this.route = location.path();
      }
    });

    this.accountService.trackAccount();
  }

  ngOnInit() {
  }

  get isEditor(): boolean {
    return this.route && this.route.indexOf(LoideRoute.Editor) !== -1;
  }
}
