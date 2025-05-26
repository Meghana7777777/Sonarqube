import { GlobalResponseObject } from "../../common";
import { ItemCodeInfoModel } from "./item-code.info.model";

export class ItemCodeInfoResponse extends GlobalResponseObject {
    data: ItemCodeInfoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: ItemCodeInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}