import { CommonRequestAttrs } from "../../common";
import { ShippingRequestProceedingEnum } from "../enum";

export class ShippingRequestFilterRequest extends CommonRequestAttrs {
    manufacturingOrderPks: string[];
    proceedingStatus: ShippingRequestProceedingEnum[];

   
    iNeedVendorInfoAlso: boolean;
    iNeedTruckInfoAlso: boolean;
    iNeedSrItemsAlso: boolean;
    iNeedSrItemsAttrAlso: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderPks: string[],
        proceedingStatus: ShippingRequestProceedingEnum[],
        iNeedVendorInfoAlso: boolean,
        iNeedTruckInfoAlso: boolean,
        iNeedSrItemsAlso: boolean,
        iNeedSrItemsAttrAlso: boolean
    ) {
        super(username, unitCode, companyCode, userId)
        this.manufacturingOrderPks = manufacturingOrderPks
        this.proceedingStatus = proceedingStatus
        this.iNeedVendorInfoAlso = iNeedVendorInfoAlso
        this.iNeedTruckInfoAlso = iNeedTruckInfoAlso;
        this.iNeedSrItemsAlso = iNeedSrItemsAlso;
        this.iNeedSrItemsAttrAlso = iNeedSrItemsAttrAlso;
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}


// {
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "username": "rajesh",
//     "manufacturingOrderPks": ["566"],
//     "proceedingStatus": [],
//     "iNeedVendorInfoAlso": false,
//     "iNeedTruckInfoAlso": false,
//     "iNeedSrItemsAlso": false,
//     "iNeedSrItemsAttrAlso": false,
// }