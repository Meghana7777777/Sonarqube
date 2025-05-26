import { GlobalResponseObject } from "../../../common/global-response-object";
import { ItemModel } from "./bom-item-model";


export class ItemResponse extends GlobalResponseObject {
    data?: ItemModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ItemModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}