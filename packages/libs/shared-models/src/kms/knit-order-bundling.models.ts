import { LargeNumberLike } from "crypto";
import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KC_KnitJobFeatures, KC_KnitJobModel, KC_ProductSku } from "./knit-job.models";


export class KMS_R_KnitOrderElgBundlesResponse extends GlobalResponseObject {
    data?: KMS_R_KnitOrderProductWiseElgBundlesModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KMS_R_KnitOrderProductWiseElgBundlesModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KMS_R_KnitOrderProductWiseElgBundlesModel {
    procSerial: number;
    processType: ProcessTypeEnum;
    productCode: string;
    productName: string;
    elgBundles: KMS_R_KnitOrderElgBundleModel[];
    // constructor(
    //     procSerial: number,
    //     processType: ProcessTypeEnum,
    //     productCode: string,
    //     productName: string,
    //     elgBundles: KMS_R_KnitOrderElgBundleModel[]
    // ) {
    //     this.procSerial = procSerial;
    //     this.processType = processType;
    //     this.productCode = productCode;
    //     this.productName = productName;
    //     this.elgBundles = elgBundles;
    // }
}

export class KMS_R_KnitOrderElgBundleModel {
    bundleNumber: string;
    pslId: number;
    quantity: number;
    color: string;
    size: string;
    // constructor(
    //     bundleNumber: string,
    //     pslId: number,
    //     quantity: number,
    //     color: string,
    //     size: string    
    // ) { 
    //     this.bundleNumber = bundleNumber;
    //     this.pslId = pslId;
    //     this.quantity = quantity;
    //     this.color = color;
    //     this.size = size;
    // }
}


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "procSerial": 3,
//     "processingType": "KNIT",
//     "productCode":  "Shirt",
//     "fgColor": "Red",
//     "bundles": [
//         {
//             "bundleNo": "ML0001-99-B001",
//             "confirmedQty": 100
//         }
//     ]
// }

export class KMS_C_KnitOrderBundlesConfirmationRequest extends CommonRequestAttrs {
    procSerial: number; // mandatory
    processType: ProcessTypeEnum; // mandatory
    productCode: string; // mandatory
    fgColor: string; // mandatory
    bundles: KMS_C_KnitOrderConfirmedBundleModel[];
    confirmedUser: string;
    confirmedDate: string
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        processType: ProcessTypeEnum,
        productCode: string,
        fgColor: string,
        bundles: KMS_C_KnitOrderConfirmedBundleModel[],
        confirmedUser: string,
        confirmedDate: string
    ) {
        super(userName, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.processType = processType;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.bundles = bundles;
        this.confirmedUser = confirmedUser;
        this.confirmedDate = confirmedDate
    }
}

export class KMS_C_KnitOrderConfirmedBundleModel {
    bundleNo: string;
    confirmedQty: number; // this is the confirmed qty. if at all user explicitly want to split a bundle due to lack of panels due to some damages or inspection failures
    constructor(bundleNo: string, confirmedQty: number) {
        this.bundleNo = bundleNo;
        this.confirmedQty = confirmedQty;
    }
}





export class KMS_R_KnitJobBundlingMapResponse extends GlobalResponseObject {
    data?: KMS_R_KnitJobBundlingMapModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KMS_R_KnitJobBundlingMapModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KMS_R_KnitJobBundlingMapModel {
    bundle: string;
    depJobs: poBundlingDepMapModel[];
    qty: number;
    constructor(
        bundle: string,
        depJobs: poBundlingDepMapModel[],
        qty: number
    ) {
        this.bundle = bundle;
        this.depJobs = depJobs;
        this.qty = qty;
    }
}

export class poBundlingDepMapModel {
    subProcName: string;
    location: string;
    job: string;
    qty: string;
    constructor(
        subProcName: string,
        location: string,
        job: string,
        qty: string
    ) {
        this.subProcName = subProcName;
        this.location = location;
        this.job = job;
        this.qty = qty;
    }
}
