import { GlobalResponseObject } from "../../../common";
import { RawOrderHeaderInfoModel } from "./raw-order-header-info.model";


export class RawOrderHeaderInfoResponse extends GlobalResponseObject {
    data?: RawOrderHeaderInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RawOrderHeaderInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}