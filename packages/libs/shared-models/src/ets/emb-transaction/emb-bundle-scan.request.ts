import { CommonRequestAttrs } from "../../common";
import { RejectionScanModel } from "./rejection/rejection-scan.model";

export class EmbBundleScanRequest extends CommonRequestAttrs {
    barcode: string;
    operationCode: string;
    gQty: number;
    rQty: number;
    isReversal: boolean;
    considerFullBundleQty: boolean;
    shift: string;
    rejections: RejectionScanModel[];
    iNeedBundleDetailedResponse: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        operationCode: string,
        gQty: number,
        rQty: number,
        isReversal: boolean,
        shift: string,
        considerFullBundleQty: boolean,
        rejections: RejectionScanModel[],
        iNeedBundleDetailedResponse: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.operationCode = operationCode;
        this.gQty = gQty;
        this.rQty = rQty;
        this.isReversal = isReversal;
        this.shift = shift;
        this.considerFullBundleQty = considerFullBundleQty;
        this.rejections = rejections;
        this.iNeedBundleDetailedResponse = iNeedBundleDetailedResponse;
    }
}


// {
//     "barcode": "C3:1-1-A",
//     "operationCode": "E11",
//     "gQty": 2,
//     "rQty": 0,
//     "isReversal": false,
//     "considerFullBundleQty": false,
//     "shift": "A",
//     "companyCode": "5000",
//     "username": "rajesh",
//     "unitCode": "B3", "iNeedBundleDetailedResponse": true
// }