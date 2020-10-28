import { MemberAccess, Access, FileType, FileStatus, castToFileFolderSetting, FileFolderSetting } from './../../../../api/server/models/file-folder';
import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';
import { FileFolder, castToFileFolder, FilePrivacy } from 'api/server/models/file-folder';
import { TreeNode } from 'primeng/api/treenode';
import { resolve } from 'dns';



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
    type: fileFolder.type,
    selectable: fileFolder.type === FileType.Folder,
    children: []
  } as TreeNode;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor() { }

  download(file: FileFolder) {
      const data = new Blob([file.content], {type: 'text/plain'});
      const filePath = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = filePath;
      tempLink.download = filePath.substr(filePath.lastIndexOf('/') + 1);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
  }

  getFileFolder(fileFolderId: string) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('getFileFolder', fileFolderId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  searchDocumentByName(keyword: string, filePrivacy: FilePrivacy) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('searchFileFolderByName', keyword, filePrivacy, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  filterFileFolder(keyword: string, filePrivacy: FilePrivacy = FilePrivacy.Public) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('filterFileFolder', keyword, filePrivacy, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }

  fetchPublicDocuments(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('fetchPublicFileFolder', (error, result) => {
        if (error) {
          return resolve(error);
        }
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
        resolve(result);
      });
    });
  }

  createDocument(formValues: any, selectedLocation: string, content: string = ''): Promise<R> {
    const memberAccess: MemberAccess = {
      owner: Access.rwx,
      group: formValues.member,
      other: formValues.other
    };
    const fileFolder: FileFolder = castToFileFolder(
      formValues.name, Meteor.user(), memberAccess, formValues.type,
      formValues.privacy, selectedLocation, content, formValues.group
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

  moveDocumentStatus(fileFolderId: string, fileStatus: FileStatus): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('moveFileStatus', fileFolderId, fileStatus, (error, result) => {
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

  executeFile(file: FileFolder): Promise<R> {
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

  updateDocumentSettings(formValues: any, documentId: string): Promise<R> {
    const requestUpdateSetting: FileFolderSetting = castToFileFolderSetting(
      formValues.owner, formValues.member,
      formValues.other, formValues.group, formValues.privacy);
    return new Promise<R>((resolve, reject) => {
      Meteor.call('updateFileFolderSetting', requestUpdateSetting, documentId, (error, result) => {
        // TODO Before start to use this finalize the function in BE
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }
}
