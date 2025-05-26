import { CommonRequestAttrs } from "../../../../common";


export class WMS_C_FAB_IssuanceRequest extends CommonRequestAttrs {
    whReqId: number;
    issuedBy: string;
    issuedOn: string; // date time string
    issuingItems: WMS_C_FAB_ItemLevelIssuanceRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, whReqId: number, issuedBy: string, issuedOn: string, issuingItems: WMS_C_FAB_ItemLevelIssuanceRequest[]) {
        super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
        this.issuedBy = issuedBy;
        this.issuedOn = issuedOn;
        this.issuingItems = issuingItems;
    }
}

export class WMS_C_FAB_ItemLevelIssuanceRequest {
    phItemLineId: number; // pk of the ph item lines
    issuingQty: number;
    constructor(phItemLineId: number, issuingQty: number) {
        this.phItemLineId = phItemLineId;
        this.issuingQty = issuingQty;
    }
}
