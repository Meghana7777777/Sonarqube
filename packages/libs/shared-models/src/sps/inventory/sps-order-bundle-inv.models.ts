import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class SPS_R_SpsOrderConfirmedBundlesResponse extends GlobalResponseObject {
    data ?: SPS_R_SpsOrderConfirmedBundlesModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: SPS_R_SpsOrderConfirmedBundlesModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}

export class SPS_R_SpsOrderConfirmedBundlesModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    prodWiseBundles: SPS_R_SpsOrderConfirmedBundlesProductWise[];

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        prodWiseBundles: SPS_R_SpsOrderConfirmedBundlesProductWise[]
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.prodWiseBundles = prodWiseBundles;
    }
}

export class SPS_R_SpsOrderConfirmedBundlesProductWise {
    pCode: string;
    pName: string;
    pType: string;
    bundles: SPS_R_SpsOrderConfirmedBundleModel[];

    constructor(pCode: string, pName: string, pType: string, bundles: SPS_R_SpsOrderConfirmedBundleModel[]) {
        this.pCode = pCode;
        this.pType = pType;
        this.pName = pName;
        this.bundles = bundles;
    }
}

export class SPS_R_SpsOrderConfirmedBundleModel {
    bomSku: string;
    pslId: number;
    bundleNumber: string;
    qty: number;
    confirmedQty: number; // This can reduce based on the inspection
    color: string;
    size: string;
    
    constructor( 
        bomSku: string,
        pslId: number,
        bundleNumber: string,
        qty: number,
        confirmedQty: number,// This can reduce based on the inspection
        color: string,
        size: string
    ) {
        this.bomSku = bomSku;
        this.pslId = pslId;
        this.bundleNumber = bundleNumber;
        this.qty = qty;
        this.confirmedQty = confirmedQty;
        this.color = color;
        this.size = size;
    }
    
    
}

export class SPS_R_SpsOrderOpenBundleModel {
    bomSku: string;
    pslId: number;
    bundleNumber: string;
    qty: number;
    color: string;
    size: string;
    
    constructor( 
        bomSku: string,
        pslId: number,
        bundleNumber: string,
        qty: number,
        color: string,
        size: string
    ) {
        this.bomSku = bomSku;
        this.pslId = pslId;
        this.bundleNumber = bundleNumber;
        this.qty = qty;
        this.color = color;
        this.size = size;
    }
}

export class SPS_R_SpsBundlingProductColorBundlingSummaryRequest extends CommonRequestAttrs {
    procSerial: number;
    productCode: string;
    fgColor: string;
    iNeedSizeWiseBundlesSummary: boolean; // SPS_R_KnitBundlingProductColorSizeQtyModel is retrieved
    iNeedPlannedBundles: boolean;
    iNeedInvMovedBundles: boolean;
}

export class SPS_R_SpsBundlingProductColorBundlingSummaryResponse extends GlobalResponseObject {
    data ?: SPS_R_SpsBundlingProductColorBundlingSummaryModel;
}


export class SPS_R_SpsBundlingProductColorBundlingSummaryModel {
    productCode: string;
    fgColor: string;
    jobGenQtys: SPS_R_SpsBundlingProductColorSizeProcessTypeJobGenQtyModel[]; // for the SPS order, this might be different parallel processing orders. So it will be an array
    sizeWiseBundlesSummary: SPS_R_SpsBundlingProductColorSizeQtyModel[];
    bundlesMovedToInv: SPS_R_SpsOrderConfirmedBundleModel[];
    plannedBundles: SPS_R_SpsOrderOpenBundleModel[];
}

export class SPS_R_SpsBundlingProductColorSizeProcessTypeJobGenQtyModel {
    processType: ProcessTypeEnum;
    components: string[];
    itemSku: string;
    jobGenQtys: SPS_R_SpsBundlingProductColorSizeJobGenQtyModel[];
}

export class SPS_R_SpsBundlingProductColorSizeJobGenQtyModel {
    size: string;
    jobGenQty: number;
}

export class SPS_R_SpsBundlingProductColorSizeQtyModel {
    size: string;
    orderQty: number;
    totalBundles: number;
    bundlesMovedToInv: number;
}



