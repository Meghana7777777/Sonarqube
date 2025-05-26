import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms/enum/process-type-enum";

export class INV_C_AvlBundlesForPslRequest extends CommonRequestAttrs {
    requiredPslQtys: INV_C_AvlBundlesForPslModel[];
    procSerial: number;
    procType: ProcessTypeEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        procType: ProcessTypeEnum,
        requiredPslQtys: INV_C_AvlBundlesForPslModel[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.requiredPslQtys = requiredPslQtys;
        this.procSerial = procSerial;
        this.procType = procType;
    }
}

export class INV_C_AvlBundlesForPslModel {
    pslId: number;
    askingQty: number;
    fgSku: string;
    considerActualBundles: boolean;

    constructor(
        pslId: number,
        askingQty: number,
        fgSku: string,
        considerActualBundles: boolean
    ) {
        this.pslId = pslId;
        this.askingQty = askingQty;
        this.fgSku = fgSku;
        this.considerActualBundles = considerActualBundles;
    }
}


export class INV_R_AvlBundlesForPslResponse extends GlobalResponseObject {
    data?: INV_R_ArrangedAvlBundlesForPslModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: INV_R_ArrangedAvlBundlesForPslModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class INV_R_ArrangedAvlBundlesForPslModel {
    pslId: number;
    avlBundles: INV_R_AvlBundlesForPslModel[];
    requestedQty: number;
    arrangedQty: number;

    constructor(
        pslId: number,
        avlBundles: INV_R_AvlBundlesForPslModel[],
        requestedQty: number,
        arrangedQty: number
    ) {
        this.pslId = pslId;
        this.avlBundles = avlBundles;
        this.requestedQty = requestedQty;
        this.arrangedQty = arrangedQty;
    }
}

export class INV_R_AvlBundlesForPslModel {
    bundleBarcode: string;
    aQty: number;

    constructor(
        bundleBarcode: string,
        aQty: number
    ) {
        this.bundleBarcode = bundleBarcode;
        this.aQty = aQty;
    }
}