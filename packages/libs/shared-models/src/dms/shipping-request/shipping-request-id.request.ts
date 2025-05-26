import { CommonRequestAttrs } from "../../common";

export class ShippingRequestIdRequest extends CommonRequestAttrs {
    srIds: number[]; // PK of the shipping_request
    remarks: string; // used when we approve/reject/ other status change

    iNeedVendorInfoAlso: boolean;
    iNeedTruckInfoAlso: boolean;
    iNeedSrItemsAlso: boolean;
    iNeedSrItemsAttrAlso: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        srIds: number[],
        remarks: string,
        iNeedVendorInfoAlso: boolean,
        iNeedTruckInfoAlso: boolean,
        iNeedSrItemsAlso: boolean,
        iNeedSrItemsAttrAlso: boolean
    ) {
        super(username, unitCode, companyCode, userId)
        this.srIds = srIds
        this.remarks = remarks
        // this.status=status
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
        this.iNeedVendorInfoAlso = iNeedVendorInfoAlso
        this.iNeedTruckInfoAlso = iNeedTruckInfoAlso;
        this.iNeedSrItemsAlso = iNeedSrItemsAlso;
        this.iNeedSrItemsAttrAlso = iNeedSrItemsAttrAlso;
    }
}

// {
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "username": "rajesh",
//     "srIds": [7],
//     "remarks": "some",
//     "iNeedVendorInfoAlso": false,
//     "iNeedTruckInfoAlso": false,
//     "iNeedSrItemsAlso": false,
//     "iNeedSrItemsAttrAlso": false,
// }