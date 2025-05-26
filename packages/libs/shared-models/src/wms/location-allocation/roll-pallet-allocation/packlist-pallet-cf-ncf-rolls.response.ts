import { GlobalResponseObject } from "../../../common";
import { PackListPalletCfNcfPfendingRollsModel } from "./packlist-pallet-cf-ncf-rolls.model";


export class PackListPalletCfNcfPfendingRollsResponse extends GlobalResponseObject {
    data?: PackListPalletCfNcfPfendingRollsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackListPalletCfNcfPfendingRollsModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
