import { GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../enum";

export class MO_R_OslBundlesResponse extends GlobalResponseObject {
    data?: MO_R_OslProcTypeBundlesModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: MO_R_OslProcTypeBundlesModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class MO_R_OslProcTypeBundlesModel {
    bundles: MO_R_OslBundlesModel[];
    procType: ProcessTypeEnum;

    constructor(
        bundles: MO_R_OslBundlesModel[],
        procType: ProcessTypeEnum
    ) {
        this.bundles = bundles;
        this.procType = procType;
    }
}

export class MO_R_OslBundlesModel {
    bundleBarcode: string;
    bundleQty: number;
    procType: ProcessTypeEnum;
    pslId: number;
    fgSku: string;

    constructor(
        bundleBarcode: string,
        bundleQty: number,
        procType: ProcessTypeEnum,
        pslId: number,
        fgSku: string
    ) {
        this.bundleBarcode = bundleBarcode;
        this.bundleQty = bundleQty;
        this.procType = procType;
        this.pslId = pslId;
        this.fgSku = fgSku;
    }
}

