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

  constructor() { }

  ngOnInit(): void {
    let toolbarButtonMenu  = [
      {id: PreferenceToolbarMenuItems.UpdatePreferences, class:'btn btn-success', iconClass: 'icon icon-create', labelIndex: 'group.create_group'}
    ];

    this.preferenceToolbar = {
      enableButtonMenu: true,
      enableSort: true,
      buttonMenu: toolbarButtonMenu
    }
  }

}
