import { CommonRequestAttrs } from "../../../common";
import { CurrentPalletLocationEnum } from "../../enum";
import { RollIdRequest } from "../roll-id.request";

export class PalletRollMappingRequest extends CommonRequestAttrs {
    packingListId?: number;
    palletId: number;
    // isDirectAllocation: boolean; // this means, if this is true -> then the roll will be mapped to the pallet with CONFIRM status
    isOverRideSysAllocation: boolean; // false
    mappingRequestFor?: CurrentPalletLocationEnum;
    allowPartialAllocation: boolean;
    rollInfo: RollIdRequest[];
    markAsIssued?: boolean; // This is utilized during the de-allocation of the roll from the pallet. If this is set to true, then we will mark the entrire roll qty as issued. 
    insRollOverride?: boolean; // inspection roll . 
    constructor(username: string, unitCode: string, companyCode: string, userId: number, packingListId: number, palletId: number, isOverRideSysAllocation: boolean, mappingRequestFor: CurrentPalletLocationEnum, allowPartialAllocation: boolean, rollInfo: RollIdRequest[], markAsIssued?: boolean, insRollOverride?: boolean) {
        super(username, unitCode, companyCode, userId)
        this.packingListId = packingListId;
        this.palletId = palletId;
        this.isOverRideSysAllocation = isOverRideSysAllocation;
        this.mappingRequestFor = mappingRequestFor;
        this.allowPartialAllocation = allowPartialAllocation;
        this.rollInfo = rollInfo;
        this.markAsIssued = markAsIssued;
        this.insRollOverride = insRollOverride;
    }
}
