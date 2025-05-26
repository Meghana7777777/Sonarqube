import { LargeNumberLike } from "crypto";
import { CommonRequestAttrs, GlobalResponseObject, PoKnitBundlingMoveToInvStatusEnum } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KC_KnitJobFeatures, KC_KnitJobModel, KC_ProductSku } from "./knit-job.models";


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "confirmationId": 1744870836485,
//     "processType": "KNIT",
//     "ackStatus": 0
// }

export class KMS_C_KnitOrderBundlingConfirmationIdRequest extends CommonRequestAttrs {
    confirmationId: number;
    processType: ProcessTypeEnum;
    ackStatus?: PoKnitBundlingMoveToInvStatusEnum;
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        confirmationId: number,
        processType: ProcessTypeEnum,
        ackStatus?: PoKnitBundlingMoveToInvStatusEnum
    ) {
        super(userName, unitCode, companyCode, userId);
        this.confirmationId = confirmationId;
        this.processType = processType;
        this.ackStatus = ackStatus;
    }
}

export class KMS_R_KnitOrderConfirmedBundlesResponse extends GlobalResponseObject {
    data ?: KMS_R_KnitOrderConfirmedBundlesModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KMS_R_KnitOrderConfirmedBundlesModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}

export class KMS_R_KnitOrderConfirmedBundlesModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    prodWiseBundles: KMS_R_KnitOrderConfirmedBundlesProductWise[];

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        prodWiseBundles: KMS_R_KnitOrderConfirmedBundlesProductWise[]
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.prodWiseBundles = prodWiseBundles;
    }
}

export class KMS_R_KnitOrderConfirmedBundlesProductWise {
    pCode: string;
    pName: string;
    pType: string;
    bundles: KMS_R_KnitOrderConfirmedBundleModel[];

    constructor(pCode: string, pName: string, pType: string, bundles: KMS_R_KnitOrderConfirmedBundleModel[]) {
        this.pCode = pCode;
        this.pType = pType;
        this.pName = pName;
        this.bundles = bundles;
    }
}

export class KMS_R_KnitOrderConfirmedBundleModel {
    bomSku: string;
    pslId: number;
    pbNumber: string;
    abNumber: string;
    qty: number;
    confirmedQty: number; // This can reduce based on the inspection
    color: string;
    size: string;
    
    constructor( 
        bomSku: string,
        pslId: number,
        pbNumber: string,
        abNumber: string,
        qty: number,
        confirmedQty: number,// This can reduce based on the inspection
        color: string,
        size: string
    ) {
        this.bomSku = bomSku;
        this.pslId = pslId;
        this.pbNumber = pbNumber;
        this.abNumber = abNumber;
        this.qty = qty;
        this.confirmedQty = confirmedQty;
        this.color = color;
        this.size = size;
    }
}

export class KMS_R_KnitOrderOpenBundleModel {
    bomSku: string;
    pslId: number;
    pbNumber: string;
    abNumber: string;
    qty: number;
    color: string;
    size: string;
    
    constructor( 
        bomSku: string,
        pslId: number,
        pbNumber: string,
        abNumber: string,
        qty: number,
        color: string,
        size: string
    ) {
        this.bomSku = bomSku;
        this.pslId = pslId;
        this.pbNumber = pbNumber;
        this.abNumber = abNumber;
        this.qty = qty;
        this.color = color;
        this.size = size;
    }
}

export class KMS_R_KnitBundlingProductColorBundlingSummaryRequest extends CommonRequestAttrs {
    procSerial: number;
    productCode: string;
    fgColor: string;
    iNeedSizeWiseBundlesSummary: boolean; // KMS_R_KnitBundlingProductColorSizeQtyModel is retrieved
    iNeedPlannedBundles: boolean;
    iNeedInvMovedBundles: boolean;
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        productCode: string,
        fgColor: string,
        iNeedSizeWiseBundlesSummary: boolean,
        iNeedPlannedBundles: boolean,
        iNeedInvMovedBundles: boolean,
    ) {
        super(userName, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.iNeedSizeWiseBundlesSummary = iNeedSizeWiseBundlesSummary;
        this.iNeedPlannedBundles = iNeedPlannedBundles;
        this.iNeedInvMovedBundles = iNeedInvMovedBundles;
    }
}

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "procSerial": 3,
//     "productCode": "Shirt",
//     "fgColor": "Red"
// }

export class KMS_R_KnitBundlingProductColorBundlingSummaryResponse extends GlobalResponseObject {
    data ?: KMS_R_KnitBundlingProductColorBundlingSummaryModel;
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KMS_R_KnitBundlingProductColorBundlingSummaryModel
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class KMS_R_KnitBundlingProductColorBundlingSummaryModel  {
    productCode: string;
    fgColor: string;
    jobGenQtys: KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel[];
    sizeWiseBundlesSummary: KMS_R_KnitBundlingProductColorSizeQtyModel[];
    bundlesMovedToInv: KMS_R_KnitOrderConfirmedBundleModel[];
    plannedBundles: KMS_R_KnitOrderOpenBundleModel[];
    constructor(
        productCode: string,
        fgColor: string,
        jobGenQtys: KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel[],
        sizeWiseBundlesSummary: KMS_R_KnitBundlingProductColorSizeQtyModel[],
        bundlesMovedToInv: KMS_R_KnitOrderConfirmedBundleModel[],
        plannedBundles: KMS_R_KnitOrderOpenBundleModel[]
    ) {
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.jobGenQtys = jobGenQtys;
        this.sizeWiseBundlesSummary = sizeWiseBundlesSummary;
        this.bundlesMovedToInv = bundlesMovedToInv;
        this.plannedBundles = plannedBundles;
    }
}

export class KMS_R_KnitBundlingProductColorSizeKnitGroupJobGenQtyModel {
    knitGroup: string;
    components: string[];
    itemCodes: string[];
    jobGenQtys: KMS_R_KnitBundlingProductColorSizeJobGenQtyModel[];
    constructor(
        knitGroup: string,
        components: string[],
        itemCodes: string[],
        jobGenQtys: KMS_R_KnitBundlingProductColorSizeJobGenQtyModel[]
    ) {
        this.knitGroup = knitGroup;
        this.components = components;
        this.itemCodes = itemCodes;
        this.jobGenQtys = jobGenQtys;
    }
}

export class KMS_R_KnitBundlingProductColorSizeJobGenQtyModel {
    size: string;
    jobGenQty: number;
    constructor(
        size: string,
        jobGenQty: number
    ) {
        this.size = size;
        this.jobGenQty = jobGenQty;
    }
}

export class KMS_R_KnitBundlingProductColorSizeQtyModel {
    size: string;
    orderQty: number;
    totalBundles: number;
    bundlesMovedToInv: number;
    qtyMovedToInv: number;
    constructor(
        size: string,
        orderQty: number,
        totalBundles: number,
        bundlesMovedToInv: number,
        qtyMovedToInv: number
    ) { 
        this.size = size;
        this.orderQty = orderQty;
        this.totalBundles = totalBundles;
        this.bundlesMovedToInv = bundlesMovedToInv;
        this.qtyMovedToInv = qtyMovedToInv;
    }
}



