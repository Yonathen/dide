import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './editor/editor.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { DocumentsComponent } from './documents/documents.component';
import { GroupComponent } from './group/group.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ArchiveComponent } from './archive/archive.component';
import { TrashComponent } from './trash/trash.component';
import { AdminPreferencesComponent } from './preferences/components/admin-preferences/admin-preferences.component';
import { TabsComponent } from './editor/components/tabs/tabs.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'editor', component: EditorComponent, children: [
    {path: '', redirectTo: 'tabs', pathMatch: 'full'},
    {path: 'tabs', component: TabsComponent}
  ]},
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'documents', pathMatch: 'full'},
    {path: 'documents', component: DocumentsComponent},
    {path: 'group', component: GroupComponent},
    {path: 'preferences', component: PreferencesComponent},
    {path: 'admin', component: AdminPreferencesComponent},
    {path: 'archive', component: ArchiveComponent},
    {path: 'trash', component: TrashComponent}
  ]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
