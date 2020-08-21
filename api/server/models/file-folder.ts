import { Group } from './group';
import { User } from './user';
import { DateTime } from './utility-date-time';
import { Editor } from './editor';

export enum FilePrivacy {
    Private = 'Private',
    Public = 'Public'
}

export enum FileType {
    File = 'File',
    Folder = 'Folder'
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
    _id: string;
    name: string;
    parent?: string;
    content?: string;
    properties: FileProperty;
    owner: User;
    group: Group;
    memberAccess: MemberAccess;
    type: FileType;
    detail: string;
    privacy: FilePrivacy; 
    /*
    openFileInEditor(): any;
    notifyChanges(): any;
    */
}

export function ownerHasAccess(userId: string, accesses: Access[], fileFolder: FileFolder): boolean {
    const accessIndex = accesses.findIndex( access => access === fileFolder.memberAccess.owner );
    return ( userId !== fileFolder.owner._id && accessIndex !== -1 );
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
    let updatedChanges: FileChange[] = fileFolder.properties.changes;
    updatedChanges.push(change);
    return {
        'properties.lastModifiedDateTime': new Date(), 
        'properties.lastModifiedBy': Accounts.user, 
        'properties.changes': updatedChanges
    };
}