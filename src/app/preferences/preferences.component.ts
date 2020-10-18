import { Component, OnInit } from '@angular/core';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';

export enum PreferenceToolbarMenuItems {
  UpdatePreferences
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  public preferenceToolbar: LoideToolbarMenu;
  public updatePreferenceDialog: boolean;

  constructor() { }

  ngOnInit(): void {
    const toolbarButtonMenu  = [
      {id: PreferenceToolbarMenuItems.UpdatePreferences, class: 'btn btn-success', iconClass: 'icon icon-create', labelIndex: 'preference.update_preferences'}
    ];

    this.preferenceToolbar = {
      enableButtonMenu: true,
      buttonMenu: toolbarButtonMenu
    };
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
  }
}
