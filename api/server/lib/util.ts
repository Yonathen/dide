
export class Util {
    constructor() {

    }

    valueExist(value) {
        return value !== undefined && value !== null;
    }
}

export const util = new Util();