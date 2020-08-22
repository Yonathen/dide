import { Profile } from './user';


export interface UserAccount {
    username?: string;
    email: string;
    password: string;
    profile: Profile;
}