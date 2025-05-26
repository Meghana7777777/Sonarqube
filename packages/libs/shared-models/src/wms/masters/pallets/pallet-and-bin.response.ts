
import { GlobalResponseObject } from "../../../common";
import { PalletAndBinModel } from "./pallet-and-bin.model";

export class PalletAndBinResponse extends GlobalResponseObject {
    data?: PalletAndBinModel[];

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: PalletAndBinModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}