import { Component, OnInit } from '@angular/core';
import { DideMenuItem } from 'src/app/shared/model/menu-item';
import { DideToolbarMenu } from 'src/app/shared/model/toolbar-menu';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export enum AdminPreferenceMenuItems {
  Language, Solver, Appearance
}
export enum AdminPreferenceToolbarMenuItems {
  AddLanguage, AddSolver, AddAppearance
}

@Component({
  selector: 'app-admin-preferences',
  templateUrl: './admin-preferences.component.html',
  styleUrls: ['./admin-preferences.component.scss']
})
export class AdminPreferencesComponent implements OnInit {

  public newLanguageDialog: boolean = false;
  public newSolverDialog: boolean = false;
  public newAppearanceDialog: boolean = false;

  public mainMenuItems: DideMenuItem[];
  public gridItemMenu: MenuItem[];
  public adminToolbar: DideToolbarMenu;

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
    this.gridItemMenu = [
      {label: this.translateService.instant('common.see_detail'), icon: 'icon icon-see_detail'},
      {label: this.translateService.instant('common.update'), icon: 'icon icon-update'},
      {label: this.translateService.instant('common.remove'), icon: 'icon icon-delete'}
    ];

    let toolbarButtonMenu  = [
      {id: AdminPreferenceToolbarMenuItems.AddLanguage, class:'btn btn-info', iconClass: 'icon icon-add', labelIndex: 'preference.add_language'},
      {id: AdminPreferenceToolbarMenuItems.AddAppearance, class:'btn btn-success', iconClass: 'icon icon-add', labelIndex: 'preference.add_appearance'},
      {id: AdminPreferenceToolbarMenuItems.AddSolver, class:'btn btn-warning', iconClass: 'icon icon-add', labelIndex: 'preference.add_solver'}
    ];

    this.adminToolbar = {
      enableButtonMenu: true,
      enableSort: true,
      buttonMenu: toolbarButtonMenu
    }
    
    this.mainMenuItems = [
      {id: AdminPreferenceMenuItems.Language, iconClass: 'icon-translate', labelIndex: 'preference.language', active: true},
      {id: AdminPreferenceMenuItems.Appearance, iconClass: 'icon-appearance', labelIndex: 'preference.appearance', active: false},
      {id: AdminPreferenceMenuItems.Solver, iconClass: 'icon-new-tab', labelIndex: 'preference.solver', active: false}
    ];
  }

  onClickToolbarButton(item: number | string) {
    switch(item) {
      case AdminPreferenceMenuItems.Language:
        this.newLanguageDialog = true;
        break;
      case AdminPreferenceMenuItems.Solver:
        this.newSolverDialog = true;
        break;
      case AdminPreferenceMenuItems.Appearance:
        this.newAppearanceDialog = true;
        break;
    }
  }

}
