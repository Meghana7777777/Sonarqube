import { CommonRequestAttrs } from "../../common";

export class PkDSetFilterRequest extends CommonRequestAttrs {
    manufacturingOrderPks: string[];

    iNeedItemsAlso: boolean;
    iNeedSubItemsAlso: boolean;
    iNeedContainersAlso: boolean;
    iNeedItemAttrAlso: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderPks: string[],
        iNeedItemsAlso: boolean,
        iNeedSubItemsAlso: boolean,
        iNeedContainersAlso: boolean,
        iNeedItemAttrAlso: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderPks = manufacturingOrderPks
        this.iNeedItemsAlso = iNeedItemsAlso
        this.iNeedSubItemsAlso = iNeedSubItemsAlso
        this.iNeedContainersAlso = iNeedContainersAlso;
        this.iNeedItemAttrAlso = iNeedItemAttrAlso;
    }
}


// {
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "username": "rajesh",
//     "manufacturingOrderPks": ["566"],
//     "proceedingStatus": [],
//     "iNeedItemsAlso": false,
//     "iNeedSubItemsAlso": false,
//     "iNeedContainersAlso": false,
//     "iNeedItemAttrAlso": false
// }