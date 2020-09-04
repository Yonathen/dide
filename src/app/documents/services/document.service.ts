import { MemberAccess, Access, FileType } from './../../../../api/server/models/file-folder';
import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';
import { FileFolder, castToFileFolder } from 'api/server/models/file-folder';
import { TreeNode } from 'primeng/api/treenode';



export function castToTree(fileFolders: FileFolder[], parentId: string): TreeNode[] {
  const selected: FileFolder[] = fileFolders.filter( elt => elt.parent === parentId);
  const result: TreeNode[] = selected.map( fileFolder => castToTreeNode(fileFolder) );


  for ( const resultFileFolder of result ) {
    resultFileFolder.children = castToTree(fileFolders, resultFileFolder.data._id);
  }

  return result;
}

export function castToTreeNode(fileFolder: FileFolder): TreeNode {
  return {
    label: fileFolder.name,
    data: fileFolder,
    expandedIcon: fileFolder.type === FileType.Folder ? 'icon icon-folder-open' : 'icon icon-file',
    collapsedIcon: fileFolder.type === FileType.Folder ? 'icon icon-folder' : 'icon icon-file',
    key: fileFolder._id,
    selectable: fileFolder.type === FileType.Folder,
    children: []
  } as TreeNode;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor() { }

  searchDocumentByName(keyword: string) {

  }

  fetchPublicDocuments(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('fetchPublicFileFolder', (error, result) => {
        if (error) {
          return resolve(error);
        }
        result.returnValue = castToTree(result.returnValue, 'root');
        resolve(result);
      });
    });
  }

  fetchPrivateDocuments(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('getUserFiles', (error, result) => {
        if (error) {
          return resolve(error);
        }

        result.returnValue = castToTree(result.returnValue, 'root');
        resolve(result);
      });
    });
  }

  createDocument(formValues: any, selectedLocation: string, content?: string): Promise<R> {
    const memberAccess: MemberAccess = {
      owner: Access.rwx,
      group: formValues.member,
      other: formValues.other
    };
    const fileFolder: FileFolder = castToFileFolder(
      formValues.name, Meteor.user(), memberAccess, formValues.type,
      formValues.privacy, selectedLocation, formValues.group, content
    );
    return new Promise<R>((resolve, reject) => {
      Meteor.call('createFileFolder', fileFolder, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  updateDocument(fileFolderId: string, newContent: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('updateFileContent', fileFolderId, newContent, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  renameDocument(fileFolderId: string, newFileFolderName: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('renameFileFolder', fileFolderId, newFileFolderName, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  removeDocument(fileFolderId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('removeFileFolderPermanently', fileFolderId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  moveDocument(fileFolderId: string, destinationId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('moveFileFolder', fileFolderId, destinationId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  executeFile(file: FileFolder) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('moveFileFolder', file, (error, result) => {
        // TODO Before start to use this finalize the function in BE
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }
}
