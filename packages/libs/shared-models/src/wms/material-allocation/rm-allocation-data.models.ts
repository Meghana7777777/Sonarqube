import { GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class Rm_R_OutAllocationInfoAndBundlesResponse extends GlobalResponseObject{
    data?: Rm_R_OutAllocationInfoAndBundlesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: Rm_R_OutAllocationInfoAndBundlesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class Rm_R_OutAllocationInfoAndBundlesModel {
    allocationId: number;
    allocatedBy: string;
    allocatedDate: string; // date time
    issued: boolean;
    issuedBy: string;
    issuedDate: string;
    forcedPartialAllocation: boolean;
    bundles: Rm_R_InvOutAllocationBundleModel[];
    refId: number; // PK of the WH request
}

export class Rm_R_InvOutAllocationBundleModel {
    itemSku: string;
    bunBarcode: string;
    aQty: number; // allocated qty
    rQty: number; // requested qty
    iQty: number; // issued qty
    issued: boolean;
}

export class Rm_issuanceInfoModel {
    issuanceNo: string;
    issuedBy: string;
    issuanceDate: string; // date time
}

export class Rm_OutAllocationInfoModel {
    exReqId: number;
    extReqNo: string;
    jobNumber: string;
    allocationId: number;
    aQty: number; // allocated qty
    rQty: number; // requested qty
    iQty: number;
    itemSku: string;
    bunBarcode: string;
}