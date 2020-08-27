import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { CreateGroupComponent } from './components/create-group/create-group.component';



@NgModule({
  declarations: [GroupComponent, CreateGroupComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class GroupModule { }
