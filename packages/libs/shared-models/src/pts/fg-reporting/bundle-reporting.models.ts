import { CommonRequestAttrs, GlobalResponseObject, JobBarcodeTypeEnum } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { PtsExtSystemNamesEnum } from "../eum";
import { FixedOpCodeEnum } from "./fixed-op-code.enum";


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "barcode": "ML0001-101-B001",
//     "opCode": "101",
//     "operatorId": 23,
//     "locationCode": "TAB1",
//     "forceReportPartial": true,
//     "shift": "A",
//     "scannedDate": "2025-04-21"
// }

export class PTS_C_BundleReportingRequest extends CommonRequestAttrs {
    barcode: string;
    opCode: string;
    operatorId: number;
    locationCode: string;
    forceReportPartial: boolean;
    shift: string;
    scannedDate: string;
    incomingQty: number; // the qty they are manually reporting. If incoming qty is not given we will try to scan the whole bundle
    rejQty: number;
    sessionId: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        opCode: string,
        operatorId: number,
        locationCode: string,
        forceReportPartial: boolean,
        shift: string,
        scannedDate: string,
        incomingQty: number,
        rejQty: number,
        sessionId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.opCode = opCode;
        this.operatorId = operatorId;
        this.locationCode = locationCode;
        this.forceReportPartial = forceReportPartial;
        this.shift = shift;
        this.scannedDate = scannedDate;
        this.incomingQty = incomingQty;
        this.rejQty = rejQty;
        this.sessionId = sessionId;
    }
}


export class PTS_R_BundleScanResponse extends GlobalResponseObject {
    data?: PTS_R_BundleScanModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PTS_R_BundleScanModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }    
}

export class PTS_R_BundleScanModel {
    barcode: string;
    opGroup: string;
    opCode: string;
    operation: FixedOpCodeEnum;
    gQtyScanned: number;
    rQtyScanned: number;
    processType: ProcessTypeEnum;
    barcodeType: JobBarcodeTypeEnum;

    constructor(
        barcode: string,
        opGroup: string,
        opCode: string,
        operation: FixedOpCodeEnum,
        gQtyScanned: number,
        rQtyScanned: number,
        processType: ProcessTypeEnum,
        barcodeType: JobBarcodeTypeEnum
    ) {
        this.barcode = barcode;
        this.opGroup = opGroup;
        this.opCode = opCode;
        this.operation = operation;
        this.gQtyScanned = gQtyScanned;
        this.rQtyScanned = rQtyScanned;
        this.processType = processType;
        this.barcodeType = barcodeType;
    }
}

export class PTS_C_BundleReversalRequest extends CommonRequestAttrs {
    barcode: string;
    opCode: string;
    inOrOut: FixedOpCodeEnum;
    operatorId: number;
    locationCode: number;
    shift: string;
    scannedDate: string;
    reversingQty: number; // the qty they are manually reversing. If not provided, we will reverse possible qty based on next operation
}


// {
//     "tranIds": [1],
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA"
// }

export class PTS_C_TranLogIdRequest extends CommonRequestAttrs {
    tranIds: number[]; // Pk of the transaction log of PTS

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        tranIds: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.tranIds = tranIds;
    }
}


export class PTS_R_TranLogIdInfoResponse extends GlobalResponseObject {
    data: PTS_R_TranLogIdInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PTS_R_TranLogIdInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PTS_C_TranLogIdPublishAckRequest extends CommonRequestAttrs {
    tranLogIds: number[];
    extSystem: PtsExtSystemNamesEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        tranLogIds: number[],
        extSystem: PtsExtSystemNamesEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.tranLogIds = tranLogIds;
        this.extSystem = extSystem;
    }
}

export class PTS_R_TranLogIdInfoModel {
    tranId: number;
    pslId: number;
    job: string;
    rQty: number;
    gQty: number;
    opGroup: string;
    opCode: FixedOpCodeEnum;
    procSerial: number;
    procType: ProcessTypeEnum;
    outPutSubSku: string;
    size: string;
    color: string;

    constructor(
        tranId: number,
        pslId: number,
        job: string,
        rQty: number,
        gQty: number,
        opGroup: string,
        opCode: FixedOpCodeEnum,
        procSerial: number,
        procType: ProcessTypeEnum,
        outPutSubSku: string,
        size: string,
        color: string
    ) 
    {
        this.tranId = tranId;
        this.pslId = pslId;
        this.job = job;
        this.rQty = rQty;
        this.gQty = gQty;
        this.opCode = opCode;
        this.opGroup = opGroup;
        this.procSerial = procSerial;
        this.procType = procType;
        this.outPutSubSku = outPutSubSku;
        this.size = size;
        this.color = color;
    }

}


export class PTS_R_TranLogFgsModel {
    pslId: number;
    fgs: number[];

    constructor(
        pslId: number,
        fgs: number[]
    ) {
        this.pslId = pslId;
        this.fgs = fgs;
    }
}

export class PTS_R_TranLogFgsResponse extends GlobalResponseObject {
    data: PTS_R_TranLogFgsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PTS_R_TranLogFgsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "operatorId": 23
// }

export class PTS_C_OperatorIdRequest extends CommonRequestAttrs {
    operatorId: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        operatorId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.operatorId = operatorId;
    }
}