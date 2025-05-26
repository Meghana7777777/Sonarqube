import { GlobalResponseObject } from "../../../common";
import { BinPalletRollInfo } from "./bin-pallet-roll-info.model";

export class BinPalletRollInfoResponse extends GlobalResponseObject{
    data : BinPalletRollInfo;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: BinPalletRollInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   