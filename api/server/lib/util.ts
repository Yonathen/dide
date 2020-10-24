import { User } from './../models/user';

export class Util {
    constructor() {

    }

    valueExist(value) {
        return value !== undefined && value !== null;
    }

    isEmpty(value) {
      return value === '' || !this.valueExist(value);
    }

    fullName(user: User) {
      return user.profile.firstName + ' ' + user.profile.lastName;
    }
}

export const util = new Util();
