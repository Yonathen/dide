import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group.component';
import { SharedModule } from '../shared/shared.module';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { ViewGroupComponent } from './components/view-group/view-group.component';
import { ManageGroupMemberComponent } from './components/manage-group-member/manage-group-member.component';



@NgModule({
  declarations: [GroupComponent, CreateGroupComponent, ViewGroupComponent, ManageGroupMemberComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class GroupModule { }
