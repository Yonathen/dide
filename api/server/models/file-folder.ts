import { Group } from './group';
import { User } from './user';
import { DateTime } from './utility-date-time';
import { Editor } from './editor';
import { Children } from 'react';

export enum FileStatus {
  Normalized = 'Normalized',
  Archived = 'Archived',
  Trashed = 'Trashed'
}

export enum FilePrivacy {
    Private = 'Private',
    Public = 'Public'
}

export enum FileType {
  File = 'File',
  Folder = 'Folder'
}

export enum AccessType {
    Read = 'r',
    Write = 'w',
    Execute = 'x',
    Null = 'n'
}

export enum Access {
    nnn = 0,
    nnx = 1,
    nwn = 2,
    nwx = 3,
    rnn = 4,
    rnx = 5,
    rwn = 6,
    rwx = 7
}

export interface MemberAccess{
    owner: Access;
    group: Access;
    other: Access;
}

export interface FileChange {
    date: Date;
    info: string;
}

export interface FileProperty {
    createdDateTime: Date;
    lastModifiedDateTime: Date;
    lastModifiedBy: User;
    changes: FileChange[];
}


export interface FileFolder {
    _id?: string;
    name: string;
    parent?: string;
    content?: string;
    properties?: FileProperty;
    owner: User;
    group?: Group;
    memberAccess: MemberAccess;
    type: FileType;
    detail?: string;
    privacy: FilePrivacy;
    status?: FileStatus;
    /*
    openFileInEditor(): any;
    notifyChanges(): any;
    */
}

export interface FileFolderSetting {
  group?: Group;
  privacy?: FilePrivacy;
  memberAccess?: MemberAccess;
}

export function ownerHasAccess(userId: string, accesses: Access[], fileFolder: FileFolder): boolean {
    const accessIndex = accesses.findIndex( access => access === fileFolder.memberAccess.owner );
    return ( userId === fileFolder.owner._id && accessIndex !== -1 );
}

export function memberHasAccess(userId: string, accesses: Access[], fileFolder: FileFolder): boolean {
    const accessIndex = accesses.findIndex( access => access === fileFolder.memberAccess.group );
    const memberIndex = fileFolder.group.members.findIndex( member => member.user._id === userId);
    return ( memberIndex !== -1 && accessIndex !== -1 );
}

export function allHasAccess(accesses: Access[], fileFolder: FileFolder): boolean {
    const accessIndex = accesses.findIndex( access => access === fileFolder.memberAccess.other );
    return ( accessIndex !== -1  );
}

export function newPropertyValue(change: FileChange, fileFolder: FileFolder): Object {
    const updatedChanges: FileChange[] = fileFolder.properties.changes;
    updatedChanges.push(change);
    return {
        'properties.lastModifiedDateTime': new Date(),
        'properties.lastModifiedBy': Accounts.user,
        'properties.changes': updatedChanges
    };
}

export function castToFileFolder(
  nameP: string,
  ownerP: User,
  memberAccessP: MemberAccess,
  typeP: FileType,
  privacyP: FilePrivacy,
  parentIdP: string = 'root',
  groupP?: Group,
  contentP?: string): FileFolder {
  return {
    name: nameP,
    parent: parentIdP,
    content: contentP,
    owner: ownerP,
    group: groupP,
    memberAccess: memberAccessP,
    type: typeP,
    privacy: privacyP,
    status: FileStatus.Normalized
  } as FileFolder;
}

export function castToFileFolderSetting(
  ownerAccess: Access,
  groupAccess: Access,
  otherAccess: Access,
  groupParam: Group,
  privacyParam: FilePrivacy
): FileFolderSetting {
  const memberAccessParam: MemberAccess = {
    owner: Access.rwx,
    group: groupAccess,
    other: otherAccess
  };

  return {
    group: groupParam,
    privacy: privacyParam,
    memberAccess: memberAccessParam
  };
}

