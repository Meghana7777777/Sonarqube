import { CommonRequestAttrs, GlobalResponseObject } from "@xpparel/shared-models";

// {
//     "poSerial": 1,
//     "productName": "Shirt-01",
//     "fgColor": "Navy Blue",
//     "iNeedDocGenQtys": true,
//     "iNeedCutRepQtys": true,
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA"
// }


export class CPS_R_CutBundlingSummaryRequest extends CommonRequestAttrs {
    poSerial: number;
    productName: string;
    fgColor: string;
    iNeedDocGenQtys: boolean;
    iNeedCutRepQtys: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        productName: string,
        fgColor: string,
        iNeedDocGenQtys: boolean,
        iNeedCutRepQtys: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.productName = productName;
        this.fgColor = fgColor;
        this.iNeedCutRepQtys = iNeedCutRepQtys;
        this.iNeedDocGenQtys = iNeedDocGenQtys;
    }
}

export class CPS_R_CutBundlingProductColorBundlingSummaryResponse extends GlobalResponseObject {
    data ?: CPS_R_CutBundlingProductColorBundlingSummaryModel;
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: CPS_R_CutBundlingProductColorBundlingSummaryModel
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class CPS_R_CutBundlingProductColorBundlingSummaryModel {
    productCode: string;
    fgColor: string;
    cgWiseQtys: CPS_R_CutBundlingProductColoCgInfoModel[];

    constructor(
        productCode: string,
        fgColor: string,
        cgWiseQtys: CPS_R_CutBundlingProductColoCgInfoModel[]
    ) {
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.cgWiseQtys = cgWiseQtys;
    }
}

export class CPS_R_CutBundlingProductColoCgInfoModel {
    rmSku: string;
    components: string[];
    refComponent: string;
    docGenQtys: CPS_R_CutBundlingDocGenQtySizeModel[];
    cutRepQtys: CPS_R_CutBundlingCutRepQtySizeModel[];
    orderQtys: CPS_R_CutBundlingOrderQtySizeModel[];

    constructor(
        rmSku: string,
        components: string[],
        refComponent: string,
        docGenQtys: CPS_R_CutBundlingDocGenQtySizeModel[],
        cutRepQtys: CPS_R_CutBundlingCutRepQtySizeModel[],
        orderQtys: CPS_R_CutBundlingOrderQtySizeModel[]
    ) {
        this.rmSku = rmSku;
        this.components = components;
        this.refComponent = refComponent;
        this.docGenQtys = docGenQtys;
        this.cutRepQtys = cutRepQtys;
        this.orderQtys = orderQtys;
    }
}

export class CPS_R_CutBundlingOrderQtySizeModel {
    size: string;
    orderQty: number;

    constructor(
        size: string,
        orderQty: number
    ) {
        this.size = size;
        this.orderQty = orderQty;
    }
}

export class CPS_R_CutBundlingDocGenQtySizeModel {
    size: string;
    docGenQty: number;
    constructor(
        size: string,
        docGenQty: number
    ) {
        this.size = size;
        this.docGenQty = docGenQty;
    }
}

export class CPS_R_CutBundlingCutRepQtySizeModel {
    size: string;
    cutRepQty: number;
    totalBundledPanels: number;
    constructor(
        size: string,
        cutRepQty: number,
        totalBundledPanels: number
    ) {
        this.size = size;
        this.cutRepQty = cutRepQty;
        this.totalBundledPanels = totalBundledPanels;
    }
}


