import { GlobalResponseObject } from "../../../common";
import { SystemPreferenceModel } from "./system-preference.model";


export class SystemPreferenceResp extends GlobalResponseObject {
    data?: SystemPreferenceModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SystemPreferenceModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   