import { MemberUser } from './user-member';

export interface AdminUser extends MemberUser {
    
    modifySolver(): any;
    modifyLanguage(): any;
    modifySettingTheme(): any;
    
}