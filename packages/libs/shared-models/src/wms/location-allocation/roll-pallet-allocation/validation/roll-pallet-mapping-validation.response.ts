import { CommonRequestAttrs, GlobalResponseObject } from "../../../../common";
import { RollPalletMappingValidationModel } from "./roll-pallet-mapping-validation.model";

export class RollPalletMappingValidationResponse extends GlobalResponseObject {
    data?: RollPalletMappingValidationModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollPalletMappingValidationModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}
