import { CommonRequestAttrs } from "../../common";

export class PkShippingRequestItemIdRequest extends CommonRequestAttrs {
    srItemId: number[]; // PK of the shipping_request
    remarks?: string; // used when we approve/reject/ other status change

    constructor(
        srItemId: number[],
        remarks?: string,
        username?: string,
        unitCode?: string,
        companyCode?: string,
        userId?: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.srItemId = srItemId
        this.remarks = remarks
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}

// {
//     "srItemId": [41],
//     "remarks": "sample"
// }

