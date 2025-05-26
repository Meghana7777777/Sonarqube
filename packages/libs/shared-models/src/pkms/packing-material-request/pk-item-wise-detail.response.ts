import { GlobalResponseObject } from "../../common";
import { PK_ItemWiseMaterialRequirementModel } from "./pk-item-wise-requirement.model";

export class PK_MaterialRequirementDetailResp extends GlobalResponseObject {
    data: PK_ItemWiseMaterialRequirementModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PK_ItemWiseMaterialRequirementModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}