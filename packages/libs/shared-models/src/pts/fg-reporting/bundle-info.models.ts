import { CommonRequestAttrs, GlobalResponseObject, JobBarcodeTypeEnum } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { PtsExtSystemNamesEnum } from "../eum";
import { FixedOpCodeEnum } from "./fixed-op-code.enum";


export class PTS_C_ProcTypeBundleBarcodeRequest extends CommonRequestAttrs {
    procSerial: number;
    processType: ProcessTypeEnum;
    prodName: string;
    fgColor: string;
    pslWiseBarcodes: PTS_C_ProcTypeBundleBarcodeModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        processType: ProcessTypeEnum,
        prodName: string,
        fgColor: string,
        pslWiseBarcodes: PTS_C_ProcTypeBundleBarcodeModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.processType = processType;
        this.prodName = prodName;
        this.fgColor = fgColor;
        this.pslWiseBarcodes = pslWiseBarcodes;
    }
}

export class PTS_C_ProcTypeBundleBarcodeModel {
    pslId: number;
    bundleBarcodes: string[];
    constructor(
        pslId: number,
        bundleBarcodes: string[]
    ) {
        this.pslId = pslId;
        this.bundleBarcodes = bundleBarcodes;
    }
}



export class PTS_R_ProcTypeBundleCompletedQtyResponse extends GlobalResponseObject {
    data: PTS_R_ProcTypeBundleBarcodeCompletedQtyModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PTS_R_ProcTypeBundleBarcodeCompletedQtyModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PTS_R_ProcTypeBundleBarcodeCompletedQtyModel {
    pslId: number;
    barcodes: PTS_R_BundleBarcodeOutputQtyModel[];

    constructor(
        pslId: number,
        barcodes: PTS_R_BundleBarcodeOutputQtyModel[]
    ) {
        this.pslId = pslId;
        this.barcodes = barcodes;
    }
}

export class PTS_R_BundleBarcodeOutputQtyModel {
    barcode: string;
    gQty: number;
    rQty: number;

    constructor(
        barcode: string,
        gQty: number,
        rQty: number
    ) {
        this.barcode = barcode;
        this.gQty = gQty;
        this.rQty = rQty;
    }
}
