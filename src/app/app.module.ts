import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DashboardModule } from './dashboard/dashboard.module';
import { ArchiveModule } from './archive/archive.module';
import { DocumentsModule } from './documents/documents.module';
import { EditorModule } from './editor/editor.module';
import { GroupModule } from './group/group.module';
import { PreferencesModule } from './preferences/preferences.module';
import { TrashModule } from './trash/trash.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    ArchiveModule,
    DocumentsModule,
    EditorModule,
    GroupModule,
    PreferencesModule,
    SharedModule,
    TrashModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
