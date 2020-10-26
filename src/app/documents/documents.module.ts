import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateDocumentComponent } from './components/create-document/create-document.component';
import { RenameDocumentComponent } from './components/rename-document/rename-document.component';
import { PropertiesDocumentComponent } from './components/properties-document/properties-document.component';


function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n');
}

@NgModule({
  declarations: [DocumentsComponent, CreateDocumentComponent, RenameDocumentComponent, PropertiesDocumentComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DocumentsModule { }

