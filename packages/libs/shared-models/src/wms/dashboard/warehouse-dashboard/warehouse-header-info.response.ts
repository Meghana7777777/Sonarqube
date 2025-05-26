import { GlobalResponseObject } from "../../../common";
import { BinPalletRollInfo } from "./bin-pallet-roll-info.model";
import { WarehouseHeaderInfoModel } from "./warehouse-header-info.model";

export class WarehouseHeaderInfoResponse extends GlobalResponseObject{
    data : WarehouseHeaderInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: WarehouseHeaderInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   