import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n');
}

@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DocumentsModule { }

