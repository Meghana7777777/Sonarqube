import { CommonRequestAttrs, PkShippingRequestStageEnum } from "@xpparel/shared-models";

export class PkDSetIdsRequest extends CommonRequestAttrs {

    dSetPks: number[]; // The array of dms.d_set PK
    remarks?: string; // Required only when we perform a delete operation

    iNeedItemsAlso: boolean;
    iNeedSubItemsAlso: boolean;
    iNeedContainersAlso: boolean;
    iNeedItemAttrAlso: boolean;

    constructor(
        dSetPks: number[], 
        remarks: string, 
        iNeedItemsAlso: boolean,
        iNeedSubItemsAlso: boolean,
        iNeedContainersAlso: boolean,
        iNeedItemAttrAlso: boolean,
        username?: string,
        unitCode?: string,
        companyCode?: string,
        userId?: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.dSetPks = dSetPks
        this.remarks = remarks
        this.iNeedItemsAlso = iNeedItemsAlso
        this.iNeedSubItemsAlso = iNeedSubItemsAlso
        this.iNeedContainersAlso = iNeedContainersAlso;
        this.iNeedItemAttrAlso = iNeedItemAttrAlso;
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}


// {
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "dSetPks": [2],
//     "remarks": "some",
//     "iNeedItemsAlso": false,
//     "iNeedSubItemsAlso": false
// }




