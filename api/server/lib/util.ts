
export class Util {
    constructor() {

    }

    valueExist(value) {
        return value !== undefined && value !== null;
    }

    isEmpty(value) {
      return value === '' || !this.valueExist(value);
    }
}

export const util = new Util();
