import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { WarehousePalletRollsModel } from "./warehouse-pallet-rolls.model";

export class WarehousePalletRollsResponse extends GlobalResponseObject {
    data?: WarehousePalletRollsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: WarehousePalletRollsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
