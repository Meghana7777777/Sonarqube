import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";



export class INV_C_InvCheckForProcTypeAndBundlesRequest extends CommonRequestAttrs {
  procTypeBundles: INV_C_InvCheckForProcTypeAndBundlesModel[];
  iNeedBundleProps: boolean;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    procTypeBundles: INV_C_InvCheckForProcTypeAndBundlesModel[],
    iNeedBundleProps: boolean
  ) {
    super(username, unitCode, companyCode, userId);
    this.procTypeBundles = procTypeBundles;
    this.iNeedBundleProps = iNeedBundleProps;
  }
}

export class INV_C_InvCheckForProcTypeAndBundlesModel {
   processType: ProcessTypeEnum;
   itemSku: string;
   bundles:  INV_C_InvCheckBundleModel[];
}

export class INV_C_InvCheckBundleModel {
    bunBarcode: string;
    rQty: number;
}



export class INV_R_InvCheckForProcTypeBundlesResponse extends GlobalResponseObject {
    data: INV_R_InvCheckForProcTypeBundlesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: INV_R_InvCheckForProcTypeBundlesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class INV_R_InvCheckForProcTypeBundlesModel {
    processType: ProcessTypeEnum;
    bundles:  INV_R_InvCheckForBundlesModel[];

    constructor(processType: ProcessTypeEnum, bundles:  INV_R_InvCheckForBundlesModel[]) {
        this.processType = processType;
        this.bundles = bundles;
    }
}

export class INV_R_InvCheckForBundlesModel {
    bunBarcode: string;
    rQty: number;
    avlQty: number;
    pslId: number;

    constructor(bunBarcode: string, rQty: number, avlQty: number, pslId: number) {
        this.bunBarcode = bunBarcode;
        this.rQty = rQty;
        this.avlQty = avlQty;
        this.pslId = pslId;
    }
}
