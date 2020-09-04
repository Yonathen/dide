import { AccessType } from './../../../api/server/models/file-folder';
import { DocumentService } from './services/document.service';
import { FileFolder, FilePrivacy, FileType } from 'api/server/models/file-folder';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoideMenuItem } from '../shared/model/menu-item';
import { MenuItem, TreeNode } from 'primeng/api';
import { LoideToolbarMenu } from '../shared/model/toolbar-menu';
import { LoideRoute } from '../shared/enums/loide-route';
import { Router } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { util } from 'api/server/lib/util';

export enum DocumentMemberMenuItems {
  Public, Private
}

export enum DocumentMenuItems {
  Public, Preference
}

export enum DocumentToolbarMenuItems {
  Import, CreateDocument
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  public loggedUserId: string;
  public createDocumentDialog: boolean = false;
  public renameDocumentDialog: boolean = false;
  public propertiesDocumentDialog: boolean = false;

  public menuItems: LoideMenuItem[];
  public gridItemMenu: MenuItem[];
  public documentToolbar: LoideToolbarMenu;
  public selectedMenuItems: LoideMenuItem;
  public documentMenuItemOpt = DocumentMemberMenuItems;

  public publicDocuments: TreeNode[] = [];
  public privateDocuments: TreeNode[] = [];

  constructor(
    public router: Router,
    public navigationService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentService) {

  }

  ngOnInit() {
    this.loggedUserId = Meteor.userId();
    this.loadPrivateDocument();
    this.loadPublicDocument();


    const toolbarButtonMenu  = [
      {id: DocumentToolbarMenuItems.Import, class: 'btn btn-info', iconClass: 'icon icon-document-public', labelIndex: 'common.import'},
      {id: DocumentToolbarMenuItems.CreateDocument, class: 'btn btn-success', iconClass: 'icon icon-folder', labelIndex: 'document.create_folder'}
    ];

    this.documentToolbar = {
      enableButtonMenu: true,
      enableSearch: true,
      enableSort: true,
      searchPlaceholderIndex: 'placeholder_serarch',
      buttonMenu: toolbarButtonMenu
    };

    this.menuItems = [
      {id: DocumentMemberMenuItems.Public, iconClass: 'icon-document-public', labelIndex: 'document.public_document', active: true},
      {id: DocumentMemberMenuItems.Private, iconClass: 'icon-document-private', labelIndex: 'document.private_document', active: false}
    ];

    this.selectedMenuItems = this.menuItems[0];
  }

  loadPublicDocument() {
    this.documentService.fetchPublicDocuments().then(result => {
      if ( result.success && result.returnValue) {
        const returnValue: TreeNode[] = result.returnValue;
        returnValue.forEach( elt => {
          if ( this.hasAccess(elt.data, AccessType.Read) ) {
            this.publicDocuments.push(elt);
          }
        });
      }
    });
  }

  loadPrivateDocument() {
    this.documentService.fetchPrivateDocuments().then(result => {
      if (result.success) {
        this.privateDocuments = result.returnValue;
      }
    });
  }

  onClickToolbarButton(menuItem: DocumentToolbarMenuItems) {
    switch (menuItem) {
      case DocumentToolbarMenuItems.CreateDocument:
        this.createDocumentDialog = true;
        break;
      case DocumentToolbarMenuItems.Import:
        break;
    }
  }

  onCancelCreateDocument(created?: any) {
    if (util.valueExist(created)) {
      if ( created.privacy === FilePrivacy.Public ) {
        this.loadPublicDocument();
      } else {
        this.loadPrivateDocument();
      }
    }
    this.createDocumentDialog = false;
  }

  onClickDashboardItem(event: number | string) {
    if (this.menuItems) {
      this.menuItems.forEach((item, index) => {
        item.active = false;
        if (item.id === event) {
          item.active = true;
          this.selectedMenuItems = item;
        }
      });
    }

    this.changeDetectorRef.detectChanges();
  }

  isSelectedMenu(itemId: number | string): boolean {
    return util.valueExist(this.selectedMenuItems) && itemId === this.selectedMenuItems.id;
  }

  isDocumentFolder(document: FileFolder) {
    return document.type === FileType.Folder;
  }

  isOwner(document: FileFolder): boolean {
    const userId = Meteor.userId();
    return document.owner._id === this.loggedUserId;
  }

  isInGroup(document: FileFolder): boolean {
    if (!util.valueExist(document.group) ||
      !util.valueExist(document.group.members)) {
        return false;
      }
    const loggedUserIndex = document.group.members.findIndex(elt => elt.user._id === this.loggedUserId);
    return loggedUserIndex >= 0;
  }

  hasWriteAccess(document: FileFolder): boolean {
    const writeAccess: number[] = [2, 3, 6, 7];

    let access: number = document.memberAccess.other;
    if ( this.isOwner(document) ) {
      access = document.memberAccess.owner;
    } else if ( this.isInGroup(document) ) {
      access = document.memberAccess.group;
    }

    return writeAccess.includes(access);
  }

  hasAccess(document: FileFolder, accessType: AccessType): boolean {
    const writeAccess: number[] = [2, 3, 6, 7];
    const readAccess: number[] = [4, 5, 6, 7];
    const executeAccess: number[] = [1, 3, 5, 7];

    let userAccess: number = document.memberAccess.other;
    if ( this.isOwner(document) ) {
      userAccess = document.memberAccess.owner;
    } else if ( this.isInGroup(document) ) {
      userAccess = document.memberAccess.group;
    }

    switch (accessType) {
      case AccessType.Write:
        return writeAccess.includes(userAccess);
      case AccessType.Read:
        return readAccess.includes(userAccess);
      case AccessType.Execute:
        return executeAccess.includes(userAccess);
    }

    return false;
  }

  getMenuItems(document: FileFolder): MenuItem[] {
    const result: MenuItem[] = [{
      label: 'File',
      items: []
    }];

    if ( this.hasAccess(document, AccessType.Read) ) {
      result[0].items.splice(0, 0,
        {label: 'Open', icon: 'icon icon-open_file', command: () => {
          this.navigationService.openEditor({ name: document.name, content: document.content });
        }},
        {label: 'Download', icon: 'icon icon-file_download'},
        {label: 'Properties', icon: 'icon icon-settings', command: ($event) => {
          this.propertiesDocumentDialog = true;
        }}
      );
    }

    if ( this.hasAccess(document, AccessType.Write) ) {
      result[0].items.splice(1, 0,
        {label: 'Rename', icon: 'icon icon-update', command: ($event) => {
          this.renameDocumentDialog = true;
        }}
      );
      result.push({
        label: 'Move',
        items: [
          {label: 'Move to', icon: 'icon icon-move'},
          {label: 'Move to archive', icon: 'icon icon-archive'},
          {label: 'Move to trash', icon: 'icon icon-delete'}
        ]
      });
    }

    return result;
  }
}
