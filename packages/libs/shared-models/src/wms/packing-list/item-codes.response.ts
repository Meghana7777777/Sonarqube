import { GlobalResponseObject } from "../../common";
import { ItemCodePoNumberModel } from "./item-code-po-number.model";


export class ItemCodesResponse extends GlobalResponseObject {
    data: ItemCodePoNumberModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ItemCodePoNumberModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}