import { CommonRequestAttrs } from "../../common";

export class LayIdsRequest extends CommonRequestAttrs {
    layIds: number[]; // the pk's of the po_docket_lay
    iNeedAdSizes: boolean;
    iNeedAdBundles: boolean; // used when getting the barcodes for the actual docket
    docketNumber: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layIds: number[],
        iNeedAdSizes: boolean,
        iNeedAdBundles: boolean,
        docketNumber: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.layIds = layIds;
        this.iNeedAdSizes = iNeedAdSizes;
        this.iNeedAdBundles = iNeedAdBundles;
        this.docketNumber = docketNumber;
    }
}


// {
//     "username": "admin",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 20,
//     "layIds": [32],
//     "iNeedAdSizes": true,
//     "iNeedAdBundles": true,
//     "docketNumber": "2475"
// }


