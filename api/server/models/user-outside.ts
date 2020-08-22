import { User } from './user';

export interface OutsideUser extends User {
    
    createAccount (user: User): any;

}