import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CardModule} from 'primeng/card';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ToolbarModule} from 'primeng/toolbar';
import {CarouselModule} from 'primeng/carousel';
import {MenuModule} from 'primeng/menu';
import {TabMenuModule} from 'primeng/tabmenu';
import {DropdownModule} from 'primeng/dropdown';
import {GMapModule} from 'primeng/gmap';
import {PaginatorModule} from 'primeng/paginator';
import {TooltipModule} from 'primeng/tooltip';
import {GalleriaModule} from 'primeng/galleria';
import {SidebarModule} from 'primeng/sidebar';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { DashboardToolbarComponent } from './components/dashboard-toolbar/dashboard-toolbar.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { AccessAccountComponent } from './components/access-account/access-account.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PageNotFoundComponent, DashboardMenuComponent, DashboardToolbarComponent, CreateAccountComponent, AccessAccountComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BrowserAnimationsModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    PaginatorModule,
    GMapModule,
    MenuModule,
    ToggleButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    CarouselModule,
    ToolbarModule,
    TabViewModule,
    TabMenuModule,
    ScrollPanelModule,
    CardModule,
    TooltipModule,
    GalleriaModule,
    SidebarModule,
    DialogModule,
    TableModule
  ], 
  exports: [
    HeaderComponent,
    FooterComponent,
    DashboardMenuComponent,
    DashboardToolbarComponent,
    PageNotFoundComponent,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BrowserAnimationsModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    PaginatorModule,
    GMapModule,
    MenuModule,
    ToggleButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    CarouselModule,
    ToolbarModule,
    TabViewModule,
    TabMenuModule,
    ScrollPanelModule,
    CardModule,
    TooltipModule,
    GalleriaModule,
    SidebarModule,
    DialogModule,
    TableModule
  ]
})
export class SharedModule { }
