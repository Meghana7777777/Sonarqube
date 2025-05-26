import { GlobalResponseObject } from "../../../common";
import { PackingListInfoModel } from "./packing-list-info.model";

export class PackingListInfoResponse extends GlobalResponseObject {
    data: PackingListInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackingListInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}