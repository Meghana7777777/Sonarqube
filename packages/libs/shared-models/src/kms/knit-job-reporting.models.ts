import { LargeNumberLike } from "crypto";
import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KC_KnitJobFeatures, KC_KnitJobModel, KC_ProductSku } from "./knit-job.models";


export class KJ_C_KnitJobReportingRequest extends CommonRequestAttrs {
    procSerial: number;
    knitJobNumber: string;
    datetime: string;
    sizeQtys: KJ_C_KnitJobSizeReportingRequest;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        knitJobNumber: string,
        datetime: string,
        sizeQtys: KJ_C_KnitJobSizeReportingRequest
    ) {
        super(username, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.knitJobNumber = knitJobNumber;
        this.datetime = datetime;
        this.sizeQtys = sizeQtys;
    }
}


export class KJ_C_KnitJobSizeReportingRequest {
    size: string;
    goodQty: number;
    rejQty: number;
    weight: number;
}

export class KJ_R_KnitJobReportedQtyModel {
    size: string;
    fgColor: string;
    reportedQty: number;
    rejectedQty: number;
    weight: number;
    reportedOn: string;
    reportedBy: string;

    constructor(
        size: string,
        fgColor: string,
        reportedQty: number,
        rejectedQty: number,
        weight: number,
        reportedOn: string,
        reportedBy: string
    ) {
        this.size = size;
        this.fgColor = fgColor;
        this.reportedQty = reportedQty;
        this.rejectedQty = rejectedQty;
        this.weight = weight;
        this.reportedOn = reportedOn;
        this.reportedBy = reportedBy;
    }

}


export class KJ_R_KnitJobReportedQtyResponse extends GlobalResponseObject {
    data ?: KJ_R_KnitJobReportedQtyModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: KJ_R_KnitJobReportedQtyModel[]) {
        super(status, errorCode, internalMessage); // Call parent constructor with required parameters
        this.data = data;
    }   
}

export class KJ_C_KnitJobNumberRequest extends CommonRequestAttrs {
    jobNumbers: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumbers: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumbers = jobNumbers;
    }
}

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "procSerial": 3,
//     "processingType": "KNIT",
//     "productCode":  "Shirt",
//     "fgColor": "Red",
//     "iNeedBundles": true
// }

export class KMS_ELGBUN_C_KnitProcSerialRequest extends CommonRequestAttrs{
    procSerial: number; // mandatory
    processingType: ProcessTypeEnum; // mandatory
    productCode: string; // mandatory
    fgColor: string; // mandatory
    iNeedBundles: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        processingType: ProcessTypeEnum,
        productCode: string,
        fgColor: string,
        iNeedBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.processingType = processingType;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.iNeedBundles = iNeedBundles;
    }
}


