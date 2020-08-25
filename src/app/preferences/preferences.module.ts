import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';
import { SharedModule } from 'primeng/api';


@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PreferencesModule { }
