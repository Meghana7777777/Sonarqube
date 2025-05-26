import { GlobalResponseObject } from "../../../common";
import { GrnUnLoadingModel } from "./grn-unloading.model";


export class GrnUnLoadingResponse extends GlobalResponseObject {
    data?: GrnUnLoadingModel[];

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: GrnUnLoadingModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}