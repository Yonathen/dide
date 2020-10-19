import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { EditorSidebarComponent } from './components/editor-sidebar/editor-sidebar.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { EditorSidebarRightComponent } from './components/editor-sidebar-right/editor-sidebar-right.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { PreferenceLanguageComponent } from './components/preference-language/preference-language.component';

@NgModule({
  declarations: [EditorComponent, EditorToolbarComponent, EditorSidebarComponent, EditorSidebarRightComponent, TabsComponent, PreferenceLanguageComponent],
  imports: [
    CommonModule,
    SharedModule,
    AceEditorModule
  ]
})
export class EditorModule { }
