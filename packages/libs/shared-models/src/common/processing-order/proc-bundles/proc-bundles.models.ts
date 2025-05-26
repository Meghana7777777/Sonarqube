import { ProcessTypeEnum } from "../../../oms";
import { CommonRequestAttrs } from "../../common-request-attr.model";
import { GlobalResponseObject } from "../../global-response-object";

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "iNeedMoSubLines": true,
//     "procSerial": 1,
//     "procType": "SEW",
//     "pslIds": [97, 98, 127, 128],
//     "iNeedBundleAttrs": false
// }

export class PBUN_C_ProcOrderRequest extends CommonRequestAttrs { 
    procSerial: number;
    procType: ProcessTypeEnum;
    pslIds: number[]; // if these are given then query the bundles against to th pslb id
    iNeedBundleAttrs: boolean;

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        procSerial: number,
        procType: ProcessTypeEnum,
        pslIds: number[],
        iNeedBundleAttrs: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.procType = procType;
        this.pslIds = pslIds;
        this.iNeedBundleAttrs = iNeedBundleAttrs;
    }
}


export class PBUN_R_ProcJobBundlesResponse extends GlobalResponseObject {
    data?: PBUN_R_ProcJobBundleModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PBUN_R_ProcJobBundleModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PBUN_R_ProcJobBundleModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    bundles: PBUN_R_JobBundleModel[];

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        bundles: PBUN_R_JobBundleModel[]
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.bundles = bundles;
    }
}

export class PBUN_R_JobBundleModel {
    bundleNo: string;
    barcode: string;
    quantity: number;
    pslId: number;
    jobNumber: string;
    opGroup: string;
    subProc: string;
    props: PBUN_R_BundleAttrModel; // usually we will never query this until required in the very worst case. Best way is to get the properties from the PSL id from OMS and map it in the Ui front

    constructor(
        bundleNo: string,
        barcode: string,
        quantity: number,
        pslId: number,
        jobNumber: string,
        opGroup: string,
        subProc: string,
        props: PBUN_R_BundleAttrModel // optional if you're rarely using it
      ) {
        this.bundleNo = bundleNo;
        this.barcode = barcode;
        this.quantity = quantity;
        this.pslId = pslId;
        this.jobNumber = jobNumber;
        this.opGroup = opGroup;
        this.subProc = subProc;
        this.props = props;
      }
}

export class PBUN_R_BundleAttrModel {
    color: string;
    size: string;
    // etc
}



export class PBUN_R_ProcBundlesResponse extends GlobalResponseObject {
    data?: PBUN_R_ProcBundleModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PBUN_R_ProcBundleModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PBUN_R_ProcBundleModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    bundles: PBUN_R_BundleModel[];

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        bundles: PBUN_R_BundleModel[]
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.bundles = bundles;
    }
}

export class PBUN_R_BundleModel {
    bundleNo: string;
    barcode: string;
    quantity: number;
    pslId: number;
    props: PBUN_R_BundleAttrModel; // usually we will never query this until required in the very worst case. Best way is to get the properties from the PSL id from OMS and map it in the Ui front

    constructor(
        bundleNo: string,
        barcode: string,
        quantity: number,
        pslId: number,
        props: PBUN_R_BundleAttrModel // optional if you're rarely using it
      ) {
        this.bundleNo = bundleNo;
        this.barcode = barcode;
        this.quantity = quantity;
        this.pslId = pslId;
        this.props = props;
      }
}