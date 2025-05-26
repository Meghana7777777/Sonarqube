import { CommonRequestAttrs, GlobalResponseObject, ProcessTypeEnum } from "@xpparel/shared-models";

/**
 * 
 * when u scan a barcode in QMS PTS_C_QmsBarcodeNumberRequest
 * response PTS_R_QmsBarcodeInfoResponse
 * when u reject some garments in QMS PTS_C_QmsBarcodeRejectionRequest
 */

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "barcodeNumber": "ML0001-101-B001"
// }


export class PTS_C_QmsBarcodeNumberRequest extends CommonRequestAttrs {
    barcodeNumber: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number, barcodeNumber: string) {
        super(username, unitCode, companyCode, userId);
        this.barcodeNumber = barcodeNumber;

    }
}


export class PTS_R_QmsBarcodeInfoResponse extends GlobalResponseObject {
    data?: PTS_R_QmsBarcodeInfoModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: PTS_R_QmsBarcodeInfoModel[]
    ) {
        super(status, errorCode, internalMessage); // Call the parent class constructor
        this.data = data;
    }
}


export class PTS_R_QmsBarcodeInfoModel {
    barcodeNumber: string;
    opGroups: PTS_R_QmsBarcodeInfoOpGroupsModel[];
    barcodeAttributes : BarcodeAttributes;

    constructor(
        barcodeNumber: string,
        opGroups: PTS_R_QmsBarcodeInfoOpGroupsModel[],
        barcodeAttributes: BarcodeAttributes
    ) {
        this.barcodeNumber = barcodeNumber;
        this.opGroups = opGroups;
        this.barcodeAttributes = barcodeAttributes;
    }
}

export class PTS_R_QmsBarcodeInfoOpGroupsModel {
    opGroup: string;
    opCodes: string[];
    fgSku: string;
    barcodeQty: number;
    goodQty: number;
    rejectedQty: number;
    jobNumber: string;
    processType: ProcessTypeEnum;

    constructor(
        opGroup: string,
        opCodes: string[],
        fgSku: string,
        barcodeQty: number,
        goodQty: number,
        rejectedQty: number,
        jobNumber: string,
        processType: ProcessTypeEnum
    ) {
        this.opGroup = opGroup;
        this.opCodes = opCodes;
        this.fgSku = fgSku;
        this.barcodeQty = barcodeQty;
        this.goodQty = goodQty;
        this.rejectedQty = rejectedQty;
        this.jobNumber = jobNumber;
        this.processType = processType;
    }
}


export class PTS_C_QmsBarcodeRejectionRequest extends CommonRequestAttrs {
    barcodeNumber: string;
    opGroup: string;
    rejectionQty: number;
    reasonDesc: string;
    rejectedOn: string; // the date time
    rejectedBy: string; // the inspector name
}


export class BarcodeAttributes {
    style: string;
    fgColor: string;
    productName: string;
    moNumber: string;
    moLineNo:string;
    size:string;
    plannedDelDate:string;
    planProdDate:string;
    planCutDate:string;

    constructor(
        style: string,
        fgColor: string,
        productName: string,
        moNumber: string,
        moLineNo: string,
        size: string,
        plannedDelDate: string,
        planProdDate: string,
        planCutDate: string
    ) {
        this.style = style;
        this.fgColor = fgColor;
        this.productName = productName;
        this.moNumber = moNumber;
        this.moLineNo = moLineNo;
        this.size = size;
        this.plannedDelDate = plannedDelDate;
        this.planProdDate = planProdDate;
        this.planCutDate = planCutDate;
      }
}