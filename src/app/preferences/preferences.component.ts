import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { AccountService } from '../shared/services/account.service';
import { SettingPreference } from 'api/server/models/setting-preference';
import { util } from 'api/server/lib/util';

export enum PreferenceToolbarMenuItems {
  UpdatePreferences
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  public preferences: SettingPreference;
  public preferenceToolbar: LoideToolbarMenu;
  public updatePreferenceDialog: boolean;
  public showPreference: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private accountService: AccountService) { }

  ngOnInit(): void {
    const toolbarButtonMenu  = [
      {id: PreferenceToolbarMenuItems.UpdatePreferences, class: 'btn btn-success', iconClass: 'icon icon-create', labelIndex: 'preference.update_preferences'}
    ];

    this.preferenceToolbar = {
      enableButtonMenu: true,
      buttonMenu: toolbarButtonMenu
    };


    this.accountService.preference.subscribe(value => {
      this.showPreference = false;
      this.changeDetectorRef.detectChanges();
      if ( util.valueExist(value) ) {
        this.preferences = value;
        this.showPreference = true;
      }
    });
  }

  onClickToolbarButton(menuItem: PreferenceToolbarMenuItems) {
    switch (menuItem) {
      case PreferenceToolbarMenuItems.UpdatePreferences:
        this.updatePreferenceDialog = true;
        break;
    }
  }

  onCancelPreference() {
    this.updatePreferenceDialog = false;
    this.changeDetectorRef.detectChanges();
  }

  isShowPreference() {
    return this.showPreference;
  }
}
