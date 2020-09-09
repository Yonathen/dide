import { Children } from 'react';
import { AccessType, FileStatus } from './../../../api/server/models/file-folder';
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
  CreateFile, CreateDocument
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

  public selectedDocument: FileFolder;
  public selectedParentId = 'root';
  public visibleNodes: TreeNode[] = [];
  public breadcrumbItems: MenuItem[] = [];
  private _publicDocuments: TreeNode[] = [];
  private _privateDocuments: TreeNode[] = [];

  get publicDocuments(): TreeNode[] {
    this.breadcrumbItems.splice(0, this.breadcrumbItems.length);
    if ( util.valueExist(this.selectedParentId) && this.selectedParentId !== 'root' ) {
      const selectedNode: TreeNode = this.getNode(this._publicDocuments);
      if ( util.valueExist(selectedNode) ) {
        this.setPath(selectedNode, this._publicDocuments);
        return selectedNode.children;
      }
      return [];
    }
    this.breadcrumbItems.splice(0, 0, {label: FilePrivacy.Public});
    return this._publicDocuments;
  }

  get privateDocuments(): TreeNode[] {
    this.breadcrumbItems.splice(0, this.breadcrumbItems.length);
    if ( util.valueExist(this.selectedParentId) && this.selectedParentId !== 'root' ) {
      const selectedNode: TreeNode = this.getNode(this._privateDocuments);
      this.setPath(selectedNode, this._privateDocuments);
      return util.valueExist(selectedNode) ? selectedNode.children : [];
    }
    this.breadcrumbItems.splice(0, 0, {label: FilePrivacy.Private});
    return this._privateDocuments;
  }

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
      {id: DocumentToolbarMenuItems.CreateDocument, class: 'btn btn-success', iconClass: 'icon icon-folder', labelIndex: 'document.create_folder'}
    ];

    this.documentToolbar = {
      enableButtonMenu: true,
      enableSearch: true,
      enableSort: true,
      searchPlaceholderIndex: 'document.placeholder_search_documents',
      buttonMenu: toolbarButtonMenu
    };

    this.menuItems = [
      {id: DocumentMemberMenuItems.Public, iconClass: 'icon-document-public', labelIndex: 'document.public_document', active: true},
      {id: DocumentMemberMenuItems.Private, iconClass: 'icon-document-private', labelIndex: 'document.private_document', active: false}
    ];

    this.selectedMenuItems = this.menuItems[0];
  }

  getNode(tree: TreeNode[]): TreeNode {
    if (!util.valueExist(tree)) {
      return;
    }

    let result: TreeNode;
    for ( const n of tree ) {
      if ( n.key === this.selectedParentId ) {
        result = n;
        break;
      }
    }

    if ( !util.valueExist(result) ) {
      for ( const n of tree ) {
        const r = this.getNode(n.children);
        if ( util.valueExist(r) ) {
          result = r;
          break;
        }
      }
    }

    return result;
  }

  getParent(node: TreeNode, tree: TreeNode[]): TreeNode {

    let result: TreeNode;
    for ( const n of tree ) {
      if ( n.children.findIndex(elt => elt.key === node.key) >= 0 ) {
        result = n;
        break;
      }
    }

    if ( !util.valueExist(result) ) {
      for ( const n of tree ) {
        const r = this.getParent(node, n.children);
        if ( util.valueExist(r) ) {
          result = r;
          break;
        }
      }
    }

    return result;
  }

  setPath(node: TreeNode, tree: TreeNode[]) {
    this.breadcrumbItems.splice(0, 0, {label: node.data.name, state: node});

    if ( node.data.parent !== 'root' ) {
      const parent: TreeNode = this.getParent(node, tree);
      this.setPath(parent, tree);
    } else {
      this.breadcrumbItems.splice(0, 0, {label: node.data.privacy});
    }
  }

  loadPublicDocument() {
    this.documentService.fetchPublicDocuments().then(result => {
      if ( result.success && result.returnValue) {
        const returnValue: TreeNode[] = result.returnValue;
        this._publicDocuments.splice(0, this._publicDocuments.length);
        returnValue.forEach( elt => {
          if ( this.hasAccess(elt.data, AccessType.Read) ) {
            this._publicDocuments.push(elt);
          }
        });
      }
    });
  }

  loadPrivateDocument() {
    this.documentService.fetchPrivateDocuments().then(result => {
      if (result.success) {
        this._privateDocuments = result.returnValue;
      }
    });
  }

  onClickToolbarButton(menuItem: DocumentToolbarMenuItems) {
    switch (menuItem) {
      case DocumentToolbarMenuItems.CreateDocument:
        this.createDocumentDialog = true;
        break;
      case DocumentToolbarMenuItems.CreateFile:
        break;
    }
  }

  onCancelChangeDocument(changed?: any) {
    this.selectedDocument = null;
    if (util.valueExist(changed)) {
      if ( changed.privacy === FilePrivacy.Public ) {
        this.loadPublicDocument();
      } else {
        this.loadPrivateDocument();
      }
    }
    this.renameDocumentDialog = false;
    this.createDocumentDialog = false;
  }

  onClickDashboardItem(event: number | string) {
    this.selectedParentId = 'root';
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
        {
          label: 'Open', icon: document.type === FileType.File ? 'icon icon-open_file' : 'icon icon-folder-open' ,
          command: () => { this.openFileFolder(document); }
        },
        { label: 'Download', icon: 'icon icon-file_download' },
        {
          label: 'Properties', icon: 'icon icon-settings', command: ($event) => {
          this.propertiesDocumentDialog = true;
        }}
      );
    }

    if ( this.hasAccess(document, AccessType.Write) ) {
      result[0].items.splice(1, 0,
        {
          label: 'Rename', icon: 'icon icon-update',
          command: () => {
            this.openRenameFileFolder(document)
          }
        }
      );
      result.push({
        label: 'Move',
        items: [
          { label: 'Move to', icon: 'icon icon-move' },
          {
            label: 'Move to archive', icon: 'icon icon-archive',
            command: () => { this.moveFileStatus(document, FileStatus.Archived); }
          },
          {
            label: 'Move to trash', icon: 'icon icon-delete',
            command: () => { this.moveFileStatus(document, FileStatus.Trashed); }
          }
        ]
      });
    }

    return result;
  }

  moveFileStatus( document: FileFolder, fileStatus: FileStatus ) {
    this.documentService.moveDocumentStatus(document._id, fileStatus).then( result => {
      if ( result.success ) {
        this.loadPrivateDocument();
        this.loadPublicDocument();
      }
    });
  }

  openRenameFileFolder(document: FileFolder) {
    this.selectedDocument = document;
    this.renameDocumentDialog = true;
  }

  openFileFolder(document: FileFolder ) {
    if ( document.type === FileType.Folder ) {
      this.selectedParentId = document._id;
    } else {
      this.navigationService.openEditor({ name: document.name, content: document.content });
    }
  }

  onClickBreadcrumb(event) {
    const item: MenuItem = event.item;
    this.selectedParentId = 'root';
    if (util.valueExist(item.state)) {
      const node: TreeNode = item.state;
      this.selectedParentId = node.key;
    }
  }
}
