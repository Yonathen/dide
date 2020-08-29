import { Injectable } from '@angular/core';
import { UserAccount } from 'api/server/models/user-account';
import { R } from 'api/server/lib/response';
import { UserType, AccountStatus, Profile } from 'api/server/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  castToUserAccount(formValue, create: boolean = true): UserAccount {
    let castedValue: UserAccount = { profile: {} } as UserAccount;
    castedValue.email = formValue.email;
    castedValue.password = formValue.password;
    if ( create ) {
      castedValue.profile = {} as Profile;
      castedValue.profile.firstName = formValue.firstName;
      castedValue.profile.lastName = formValue.lastName;
      castedValue.profile.type = UserType.Member;
      castedValue.profile.status = AccountStatus.Active;
    }
    return castedValue;
  }

  createAccount(formValue: any): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const userAccount: UserAccount = this.castToUserAccount(formValue);
      Meteor.call('createAccount', userAccount, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  accessAccount(formValue: any): Promise<R> {
     return new Promise<R>((resolve, reject) => {
      
      Meteor.loginWithPassword(formValue.email, formValue.password, (error) => {
        if (error) {
          return resolve({success: false, errorValue: error});
        }
        resolve({success: true});
      });

    });
  }

  exitAccount(): Promise<R>  {
    return new Promise<R>((resolve, reject) => {

      Meteor.logout((error) => {
        if (error) {
          return reject(error);
        }
        resolve({success: true});
      });

    });
  }
}
