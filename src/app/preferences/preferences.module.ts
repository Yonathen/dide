import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';
import { SharedModule } from '../shared/shared.module';
import { AdminPreferencesComponent } from './components/admin-preferences/admin-preferences.component';


@NgModule({
  declarations: [PreferencesComponent, AdminPreferencesComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminPreferencesComponent
  ]
})
export class PreferencesModule { }
