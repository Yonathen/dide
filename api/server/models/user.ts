import { Notification } from './notification';
import { FileFolder } from './file-folder';
import { UserAccount } from './user-account';

export enum UserType {
    Outside = 'Outside',
    Member = 'Member',
    Admin = 'Admin'
}

export enum AccountStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export interface Profile {
    firstName: string;
    lastName: string;
    type: UserType;
    status: AccountStatus;
}

export interface User extends Meteor.User {
    profile?: Profile;
}
