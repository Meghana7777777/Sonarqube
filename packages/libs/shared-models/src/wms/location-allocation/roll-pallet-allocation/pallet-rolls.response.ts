import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { PalletRollsModel } from "./pallet-rolls.model";

export class PalletRollsResponse extends GlobalResponseObject {
    data?: PalletRollsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PalletRollsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
