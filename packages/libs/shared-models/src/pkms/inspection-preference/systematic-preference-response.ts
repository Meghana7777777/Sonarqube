import { GlobalResponseObject } from "../../common";
import { SystematicPreferenceModel } from "./systematic-preference-model";



export class SystematicPreferenceResponse extends GlobalResponseObject {
    data?: SystematicPreferenceModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SystematicPreferenceModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}