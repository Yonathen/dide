import { SettingPreference } from 'api/server/models/setting-preference';
import { AccountService } from 'src/app/shared/services/account.service';
import { util } from 'api/server/lib/util';
import { PreferencesService } from 'src/app/preferences/services/preferences.service';
import { Component, OnInit } from '@angular/core';
import { SettingTheme } from 'api/server/models/setting-theme';

@Component({
  selector: 'app-preference-appearance',
  templateUrl: './preference-appearance.component.html',
  styleUrls: ['./preference-appearance.component.scss']
})
export class PreferenceAppearanceComponent implements OnInit {

  public themes: SettingTheme[] = [];
  public preference: SettingPreference;

  constructor(
    private accountService: AccountService,
    private preferenceService: PreferencesService) { }

  ngOnInit(): void {
    if ( this.themes.length === 0 ) {
      this.loadThemes();
    }

    this.accountService.preference.subscribe(preference => {
      this.preference = preference;
    });
  }

  loadThemes() {
    this.preferenceService.getSettings('getThemes').then(R => {
      if ( R.success ) {
        const themes: SettingTheme[] = R.returnValue;
        console.log(themes);
        themes.forEach(theme => {
          this.themes.push(theme);
        });
      }
    });
  }

  applyTheme(theme: SettingTheme) {
    this.preference.theme = theme;
  }

  isSelectedTheme(theme: SettingTheme): boolean {
    return this.preference.theme._id === theme._id;
  }

}
