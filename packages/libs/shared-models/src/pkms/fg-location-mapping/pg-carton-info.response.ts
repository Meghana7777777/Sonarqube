import { GlobalResponseObject } from "../../common";
import { PGCartonInfoModel } from "./pg-carton-info.model";

export class PGCartonInfoResponse extends GlobalResponseObject{
    data : PGCartonInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PGCartonInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   