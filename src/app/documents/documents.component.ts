import { Component, OnInit } from '@angular/core';
import { LoideMenuItem } from '../shared/model/menu-item';
import { MenuItem } from 'primeng/api';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { LoideRoute } from '../shared/enums/loide-route';
import { Router } from '@angular/router';

export enum DocumentMemberMenuItems {
  Public, Private
}

export enum DocumentMenuItems {
  Public, Preference
}

export enum DocumentToolbarMenuItems {
  Import, CreateFolder, CreateFile
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  public menuItems: LoideMenuItem[];
  public gridItemMenu: MenuItem[];
  public documentToolbar: LoideToolbarMenu;

  constructor(public router: Router) {

  }

  ngOnInit() {
      this.gridItemMenu = [{
          label: 'File',
          items: [
              {label: 'Open', icon: 'icon icon-open_file', command: ($event) => {
                this.router.navigate( [LoideRoute.Editor]);
              }},
              {label: 'Download', icon: 'icon icon-file_download'}
          ]
      },
      {
          label: 'Move',
          items: [
              {label: 'Move to', icon: 'icon icon-move'},
              {label: 'Move to archive', icon: 'icon icon-archive'},
              {label: 'Move to trash', icon: 'icon icon-delete'}
          ]
      }];

    let toolbarButtonMenu  = [
      {id: DocumentToolbarMenuItems.Import, class:'btn btn-info', iconClass: 'icon icon-document-public', labelIndex: 'common.import'},
      {id: DocumentToolbarMenuItems.CreateFolder, class:'btn btn-success', iconClass: 'icon icon-folder', labelIndex: 'document.button_create_folder'},
      {id: DocumentToolbarMenuItems.CreateFile, class:'btn btn-warning', iconClass: 'icon icon-insert_drive_file', labelIndex: 'document.button_create_file'}
    ];

    this.documentToolbar = {
      enableButtonMenu: true,
      enableSearch: true,
      enableSort: true,
      searchPlaceholderIndex: 'placeholder_serarch',
      buttonMenu: toolbarButtonMenu
    }
    this.menuItems = [
      {id: DocumentMemberMenuItems.Public, iconClass: 'icon-document-public', labelIndex: 'document.public', active: true},
      {id: DocumentMemberMenuItems.Private, iconClass: 'icon-document-private', labelIndex: 'document.private', active: false}
    ];
  }

}
