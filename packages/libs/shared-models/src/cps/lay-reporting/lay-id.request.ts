import { CommonRequestAttrs } from "../../common";

export class LayIdRequest extends CommonRequestAttrs {
    layId: number; // the pk of the po_docket_lay

    iNeedAdSizes: boolean;
    iNeedAdBundles: boolean; // used when getting the barcodes for the actual docket

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        iNeedAdSizes: boolean,
        iNeedAdBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.iNeedAdSizes = iNeedAdSizes;
        this.iNeedAdBundles = iNeedAdBundles;
    }
}


// {
//     "username": "admin",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "layId": 1
// }