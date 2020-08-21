import { User } from './user';

export interface MemberUser extends User {
    accessAccount(account: User): any;
    getFileFolders(): any;
    setGroup(): any;
    setPreferences(): any;
}