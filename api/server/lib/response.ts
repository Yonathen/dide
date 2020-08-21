import { util } from './util';

export interface R {
    success: boolean;
    returnValue?: any;
    errorValue?: any;
}

export class ResponseService {
    private response: R;

    constructor() {
    }

    fetchResponse(value?: any, success: boolean = true) {
        this.response = { success: success };
        
        if ( success && util.valueExist(value)) {
            this.response.returnValue = value;
        } else if ( !success && util.valueExist(value) ) {
            this.response.errorValue = value;
        }

        return this.response;
    }
}

export const response = new ResponseService();