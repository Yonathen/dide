import { Component, OnInit } from '@angular/core';
import { LoideMenuItem } from '../shared/model/menu-item';
import { MenuItem } from 'primeng/api';

export enum DocumentMemberMenuItems {
  Public, Private
}

export enum DocumentMenuItems {
  Public, Preference
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  public menuItems: LoideMenuItem[];
  items: MenuItem[];

  ngOnInit() {
      this.items = [{
          label: 'File',
          items: [
              {label: 'Open', icon: 'icon icon-open_file'},
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
    this.menuItems = [
      {id: DocumentMemberMenuItems.Public, iconClass: 'icon-document-public', labelIndex: 'document.public', active: true},
      {id: DocumentMemberMenuItems.Private, iconClass: 'icon-document-private', labelIndex: 'document.private', active: false}
    ];
  }

}
