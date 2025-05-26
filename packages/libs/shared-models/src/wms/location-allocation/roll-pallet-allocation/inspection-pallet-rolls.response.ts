import { CommonRequestAttrs, GlobalResponseObject } from "../../../common";
import { InspectionPalletRollsModel } from "./inspection-pallet-rolls.model";

export class InspectionPalletRollsResponse extends GlobalResponseObject {
    data?: InspectionPalletRollsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: InspectionPalletRollsModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
