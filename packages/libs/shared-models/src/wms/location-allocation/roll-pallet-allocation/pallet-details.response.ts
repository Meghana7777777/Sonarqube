import { GlobalResponseObject } from "../../../common";
import { PalletDetailsModel } from "./pallet-details.model";

export class PalletDetailsResponse extends GlobalResponseObject {
    data?: PalletDetailsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PalletDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}