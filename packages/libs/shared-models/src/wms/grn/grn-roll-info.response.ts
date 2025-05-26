import { GlobalResponseObject } from "../../common";
import { GrnRollInfoModel } from "./grn-roll-info.model";

export class GrnRollInfoResponse extends GlobalResponseObject{
    data : GrnRollInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: GrnRollInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   