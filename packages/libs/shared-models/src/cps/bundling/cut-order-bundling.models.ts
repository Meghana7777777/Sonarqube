import { GlobalResponseObject, CommonRequestAttrs, PoKnitBundlingMoveToInvStatusEnum, PoCutBundlingMoveToInvStatusEnum } from "../../common";
import { ProcessTypeEnum } from "../../oms";


export class CPS_R_BundlingConfirmationResponse  extends GlobalResponseObject {
    data?: CPS_R_BundlingConfirmationModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: CPS_R_BundlingConfirmationModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class CPS_R_ActualDocketsForBundlingResponse extends GlobalResponseObject {
    data?: CPS_R_ActualDocketsForBundlingModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: CPS_R_ActualDocketsForBundlingModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



export class CPS_R_ActualDocketsForBundlingModel {
    docketNumber: string;
    docketGroup: string;
    underDocLayNumber: number;
    totalDocBundles: number;
    totalCutRepQty: number;
    totalDocQty: number;
    totalBundledQty: number;
    totalActualBundles: number;
    confirmations?: CPS_R_BundlingConfirmationModel[];

    constructor(
        docketNumber: string,
        docketGroup: string,
        underDocLayNumber: number,
        totalDocBundles: number,
        totalCutRepQty: number,
        totalDocQty: number,
        totalBundledQty: number,
        totalActualBundles: number,
        confirmations?: CPS_R_BundlingConfirmationModel[]
    ) {
        this.docketNumber = docketNumber;
        this.docketGroup = docketGroup;
        this.underDocLayNumber = underDocLayNumber;
        this.totalDocBundles = totalDocBundles;
        this.totalCutRepQty = totalCutRepQty;
        this.totalDocQty = totalDocQty;
        this.totalBundledQty = totalBundledQty;
        this.totalActualBundles = totalActualBundles;
        this.confirmations = confirmations;
    }
}




export class CPS_R_BundlingConfirmationModel {
    confirmationId: number;
    mainDocket: string;
    totalBundledQty: number;
    bundles: CPS_R_CutOrderConfirmedBundleModel[];
    totalBundles: number;
    confirmedBy: string;
    confirmedOn: string; // date time 
    closed: boolean;

    constructor(
        confirmationId: number,
        mainDocket: string,
        totalBundledQty: number,
        bundles: CPS_R_CutOrderConfirmedBundleModel[],
        totalBundles: number,
        confirmedBy: string,
        confirmedOn: string,
        closed: boolean
    ) {
        this.confirmationId = confirmationId;
        this.bundles = bundles;
        this.mainDocket = mainDocket;
        this.totalBundledQty = totalBundledQty;
        this.totalBundles = totalBundles;
        this.confirmedBy = confirmedBy;
        this.confirmedOn = confirmedOn;
        this.closed = closed;
    }
}


export class CPS_R_CutOrderConfirmedBundlesResponse extends GlobalResponseObject {
    data ?: CPS_R_CutOrderConfirmedBundlesModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: CPS_R_CutOrderConfirmedBundlesModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}


export class CPS_R_CutOrderConfirmedBundlesModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    prodWiseBundles: CPS_R_CutOrderConfirmedBundlesProductWise[];

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        prodWiseBundles: CPS_R_CutOrderConfirmedBundlesProductWise[]
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.prodWiseBundles = prodWiseBundles;
    }
}

export class CPS_R_CutOrderConfirmedBundlesProductWise {
    pCode: string;
    pName: string;
    pType: string;
    bundles: CPS_R_CutOrderConfirmedBundleModel[];

    constructor(pCode: string, pName: string, pType: string, bundles: CPS_R_CutOrderConfirmedBundleModel[]) {
        this.pCode = pCode;
        this.pType = pType;
        this.pName = pName;
        this.bundles = bundles;
    }
}

export class CPS_R_CutOrderConfirmedBundleModel {
    bomSku: string;
    pslId: number;
    pbNumber: string;
    abNumber: string;
    qty: number;
    confirmedQty: number; // This can reduce based on the inspection
    color: string;
    size: string;
    shade: string;
    
    constructor( 
        bomSku: string,
        pslId: number,
        pbNumber: string,
        abNumber: string,
        qty: number,
        confirmedQty: number,// This can reduce based on the inspection
        color: string,
        size: string,
        shade: string
    ) {
        this.bomSku = bomSku;
        this.pslId = pslId;
        this.pbNumber = pbNumber;
        this.abNumber = abNumber;
        this.qty = qty;
        this.confirmedQty = confirmedQty;
        this.color = color;
        this.size = size;
        this.shade = shade;
    }
}


export class CPS_R_CutOrderEligibleBundlesResponse extends GlobalResponseObject {
    data ?: CPS_R_CutOrderConfirmedBundleModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: CPS_R_CutOrderConfirmedBundleModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "mainDocketNumber": 9494,
//     "underDocLayNumber": 1,
//     "iNeedBundles": true
// }


export class CPS_ELGBUN_C_MainDocketRequest extends CommonRequestAttrs {
    mainDocketNumber: string; // main docket number
    underDocLayNumber: number; // actual docket number
    iNeedBundles: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        mainDocketNumber: string,
        underDocLayNumber: number,
        iNeedBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.mainDocketNumber = mainDocketNumber;
        this.underDocLayNumber = underDocLayNumber;
        this.iNeedBundles = iNeedBundles;
    }
}


export class CPS_C_BundlingConfirmationRequest extends CommonRequestAttrs {
    mainDocketNumber: string; // main docket number
    underDocLayNumber: number; // actual docket number
    confirmedBy: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        mainDocketNumber: string,
        underDocLayNumber: number,
        confirmedBy: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.mainDocketNumber = mainDocketNumber;
        this.underDocLayNumber = underDocLayNumber;
        this.confirmedBy = confirmedBy;
    }
}

// {
//     "confirmationId": 1,
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
// }

export class CPS_C_BundlingConfirmationIdRequest extends CommonRequestAttrs {
    confirmationId: number; // main docket number
    ackStatus?: PoCutBundlingMoveToInvStatusEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        confirmationId: number,
        ackStatus?: PoCutBundlingMoveToInvStatusEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.confirmationId = confirmationId;
        this.ackStatus = ackStatus;
    }
}
