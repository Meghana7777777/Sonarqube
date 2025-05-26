import exp from "constants";
import { BarcodeReportingModeEnum, BarcodeTransactionTypeEnum, JobBarcodeTypeEnum, CommonRequestAttrs } from "../../common";
import { MoPropsModel } from "../../sps";
import { ProcessTypeEnum } from "../../oms";

// {
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "barcode": "",
//     "barcodeTransactionType": "GOOD", // Type of barcode transaction
//     "barcodeReportingMode": "MANUAL", // Mode of barcode reporting
//     "operationCode": "102",
//     "reportingQty": 0,
//     "jobNo": ""
// }

// PROCESS 1 : GETTING ELIGIBLE OPERATION CODES TO START THE BARCODE SCANNING SESSION
// PROCESS 2: ONCE USER SCANS THE BARCODE BY SELECTING MANUAL / AUTO / GOOD / REJECTION 
// 2.1 IF IT IS MANUAL PROCESS NEED TO GET THE BARCODE DETAILS (SIZE WISE QTY OF BUNDLE / JOB) BASED ON BARCODE TYPE
// PAYLOAD TYPE : BundleScanningRequest
export class BundleScanningRequest extends CommonRequestAttrs {
    barcode: string; // Barcode being scanned
    barcodeTransactionType: BarcodeTransactionTypeEnum; // Type of barcode transaction
    barcodeReportingMode: BarcodeReportingModeEnum; // Mode of barcode reporting
    operationCode: string;
    sessionId: number;
    reportingQty: number;
    jobNo: string;
    rejDetails?: ReasonAndQtyModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        barcodeTransactionType: BarcodeTransactionTypeEnum,
        barcodeReportingMode: BarcodeReportingModeEnum,
        operationCode: string,
        sessionId: number,
        reportingQty?: number,
        rejDetails?: ReasonAndQtyModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.barcodeTransactionType = barcodeTransactionType;
        this.barcodeReportingMode = barcodeReportingMode;
        this.operationCode = operationCode;
        this.sessionId = sessionId;
        this.reportingQty = reportingQty;
        this.rejDetails = rejDetails;
    }
}


// RESPONSE TYPE: BarcodeDetailsForBundleScanning
// Once user scans the barcode if it is manual need to give this data to user
// The same will be the payload after submitting the operation reporting for JOB/BARCODE when its manual
export class BarcodeDetailsForBundleScanning {
    barcode: string; // Barcode for bundle scanning
    barcodeType: JobBarcodeTypeEnum; // Type of the barcode
    barcodeProps: MoPropsModel; // Barcode properties
    colorAndSizeDetails: ColorAndSizeDetails[]; // Color and size details
    operationCode: string;
    processType: ProcessTypeEnum;

    companyCode: string;
    unitCode: string;
    username: string;
    
    constructor(
        barcode: string,
        barcodeType: JobBarcodeTypeEnum,
        barcodeProps: MoPropsModel,
        colorAndSizeDetails: ColorAndSizeDetails[],
        operationCode: string,
        processType: ProcessTypeEnum,
    ) {
        this.barcode = barcode;
        this.barcodeType = barcodeType;
        this.barcodeProps = barcodeProps;
        this.colorAndSizeDetails = colorAndSizeDetails;
        this.operationCode = operationCode;
        this.processType = processType;
    }
}

export class SizeDetails {
    size: string; // Size of the item
    originalQty: number; // Total quantity for the size
    reportedQty: number;
    eligibleToReportQty: number;
    reportingGoodQty: number; // Reported quantity for the size , It wil get updated after submit
    rejectionDetails: ReasonAndQtyModel[]
    constructor(size: string, originalQty: number, reportedQty: number, eligibleToReportQty: number, reportingGoodQty: number, rejectionDetails: ReasonAndQtyModel[]) {
        this.size = size;
        this.originalQty = originalQty;
        this.reportedQty = reportedQty;
        this.eligibleToReportQty = eligibleToReportQty;
        this.reportingGoodQty = reportingGoodQty;
        this.rejectionDetails = rejectionDetails;
    }
}

export class ReasonAndQtyModel {
    reasonCode: string;
    rejectedQty: number;
}

export class    ColorAndSizeDetails {
    color: string; // Color of the item
    sizesDetails: SizeDetails[]; // Details of sizes under the color
    constructor(color: string, sizesDetails: SizeDetails[]) {
        this.color = color;
        this.sizesDetails = sizesDetails;
    }
}

// 2.2 IF IT IS AUTO NEED TO REPORT THE BARCODE DIRECTLY BASED ON BARCODE TYPE AND MODE (ONLY FOR GOOD)), REJECTION ALWAYS WITH MANUAL COZ USER NEEDS TO SELECT THE REASON
// PAYLOAD TYPE : BundleScanningRequest
// RESPONSE TYPE: BarcodeScanningStatusModel

// RESPONSE AFTER SUCCESS / FAIL SUBMISSION OF ANY BARCODE EITHER MANUAL / AUTO / GOOD / REJECTION
export class BarcodeScanningStatusModel {
    barcode: string; // The scanned barcode
    barcodeType: JobBarcodeTypeEnum; // Type of the barcode
    barcodeProps: MoPropsModel; // Barcode properties
    totalGoodQuantity: number; // Total quantity marked as good
    totalRejectedQuantity: number; // Total quantity marked as rejected
    operationCode: string; // Code of the operation
    processType: ProcessTypeEnum; // Type of the process
    sessionId: number;
    qualityType: string;
    status: boolean;
    constructor(
        barcode: string,
        barcodeType: JobBarcodeTypeEnum,
        barcodeProps: MoPropsModel,
        totalGoodQuantity: number,
        totalRejectedQuantity: number,
        operationCode: string,
        processType: ProcessTypeEnum,
        sessionId: number,
        qualityType: string,
        status: boolean

    ) {
        this.barcode = barcode;
        this.barcodeType = barcodeType;
        this.barcodeProps = barcodeProps;
        this.totalGoodQuantity = totalGoodQuantity;
        this.totalRejectedQuantity = totalRejectedQuantity;
        this.operationCode = operationCode;
        this.processType = processType;
        this.sessionId = sessionId;
        this.qualityType = qualityType;
        this.status = status;
    }
}








