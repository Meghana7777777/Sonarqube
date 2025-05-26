import { GlobalResponseObject } from "../common";
import { ItemsInfoModel } from "./items.response";


export class ItemsInfoResponse extends GlobalResponseObject  {
    data ?: ItemsInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ItemsInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}