import { CommonRequestAttrs } from "../../../common";
import { PalletIdRequest } from "../pallet-id.request";

export class BinPalletMappingRequest extends CommonRequestAttrs {
    binId: number;
    isOverRideSysAllocation: boolean; // false
    palletInfo: PalletIdRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, binId: number, isOverRideSysAllocation: boolean, palletInfo: PalletIdRequest[]) {
        super(username, unitCode, companyCode, userId);
        this.binId = binId;
        this.isOverRideSysAllocation = isOverRideSysAllocation;
        this.palletInfo = palletInfo;
    }
}
