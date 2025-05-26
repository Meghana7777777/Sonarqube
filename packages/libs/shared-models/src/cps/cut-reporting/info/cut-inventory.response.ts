
import { GlobalResponseObject } from "../../../common";
import { CutInventoryModel } from "./cut-inventory.model";

export class CutInventoryResponse extends GlobalResponseObject {
    data ?: CutInventoryModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutInventoryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}