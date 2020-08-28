import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';
import { SharedModule } from '../shared/shared.module';
import { AdminPreferencesComponent } from './components/admin-preferences/admin-preferences.component';
import { CreateLanguageComponent } from './components/create-language/create-language.component';
import { CreateSolverComponent } from './components/create-solver/create-solver.component';
import { CreateAppearanceComponent } from './components/create-appearance/create-appearance.component';


@NgModule({
  declarations: [PreferencesComponent, AdminPreferencesComponent, CreateLanguageComponent, CreateSolverComponent, CreateAppearanceComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AdminPreferencesComponent
  ]
})
export class PreferencesModule { }
