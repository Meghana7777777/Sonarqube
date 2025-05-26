import { BomItemTypeEnum, CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../common";
import { ProcessTypeEnum } from "../../oms";

/**
 * When a request is sent from SPS - WH for trims, get the wh req id and save it in the SPS against the sewing job in a new log table. Maintain the issuance status and the issuance unique id also against to that
 * When a request is sent from SPS - INV for FGs, get the inv out req id and save it in the SPS against the sewing job in a new log table. Maintain the issuance status and the issuance unique id against to that
 * 
 */
export class SPS_C_ProcJobNumberRequest extends CommonRequestAttrs {
    jobNumber: string;
    iNeedFeatures: boolean;
    iNeedColSizeQty: boolean;
    iNeedBundles: boolean;
    iNeedTrims: boolean;
    iNeedDepOpSkuInfo: boolean;
    iNeedDepBundlesInfo: boolean;

    constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      jobNumber: string,
      iNeedFeatures: boolean,
      iNeedColSizeQty: boolean,
      iNeedBundles: boolean,
      iNeedTrims: boolean,
      iNeedDepOpSkuInfo: boolean,
      iNeedDepBundlesInfo: boolean
    ) {
      super(username, unitCode, companyCode, userId);
      this.jobNumber = jobNumber;
      this.iNeedFeatures = iNeedFeatures;
      this.iNeedColSizeQty = iNeedColSizeQty;
      this.iNeedBundles = iNeedBundles;
      this.iNeedTrims = iNeedTrims;
      this.iNeedDepOpSkuInfo = iNeedDepOpSkuInfo;
      this.iNeedDepBundlesInfo = iNeedDepBundlesInfo;
    }
}


export class SPS_C_ProcJobWhReqId {
    jobNumber: string;
    procSerial: number;
    whOutReqId: number; // the request id returned from the WH after creating the Trims request
}

export class SPS_C_ProcJobInvReqId {
    jobNumber: string;
    procSerial: number;
    invOutReqId: number; // the request id returned from the INv after creating the Fg level request
}

export class SPS_R_ProcJobInfoModel {
    procSerial: number;
    procType: ProcessTypeEnum;
    productCode: string;
    jobNumber: string;
    moNumber: string;
    quantity: number;
    trims: SPS_R_ProcJobTrimsModel[];
    jobDepSkuInfo: SPS_R_JobDepOpSkuInfo[];
    jobFeatures: SPS_R_JobFeaturesModel;
    bundlesInfo: SPS_R_JobBundles[];
    colorSizeQty: SPS_R_JobColorSizeModel[];
    depBundlesInfo: SPS_R_JobDepBundlesModel[];
    moProductSubLineIds: number[];
    jobPslQtys: SPS_R_JobPslQtyModel[];
    requiresActualBundles: boolean;
    subProcessName: string;

    constructor(
        procSerial: number,
        procType: ProcessTypeEnum,
        productCode: string,
        jobNumber: string,
        moNumber: string,
        quantity: number,
        trims: SPS_R_ProcJobTrimsModel[],
        jobDepSkuInfo: SPS_R_JobDepOpSkuInfo[],
        jobFeatures: SPS_R_JobFeaturesModel,
        bundlesInfo: SPS_R_JobBundles[],
        colorSizeQty: SPS_R_JobColorSizeModel[],
        depBundlesInfo: SPS_R_JobDepBundlesModel[],
        moProductSubLineIds: number[],
        jobPslQtys: SPS_R_JobPslQtyModel[],
        requiresActualBundles: boolean,
        subProcessName: string
    ) {
        this.procSerial = procSerial;
        this.procType = procType;
        this.productCode = productCode;
        this.jobNumber = jobNumber;
        this.moNumber = moNumber;
        this.quantity = quantity;
        this.trims = trims;
        this.jobDepSkuInfo = jobDepSkuInfo;
        this.jobFeatures = jobFeatures;
        this.bundlesInfo = bundlesInfo;
        this.colorSizeQty = colorSizeQty;
        this.depBundlesInfo = depBundlesInfo;
        this.moProductSubLineIds = moProductSubLineIds;
        this.jobPslQtys = jobPslQtys;
        this.requiresActualBundles = requiresActualBundles;
        this.subProcessName = subProcessName;
    }
}


export class SPS_R_JobPslQtyModel {
    pslId: number;
    orgQty: number;
    cancelledQty: number;
    jobReGenQty: number;

    constructor(
        pslId: number,
        orgQty: number,
        cancelledQty: number,
        jobReGenQty: number
    ) {
        this.pslId = pslId;
        this.orgQty = orgQty;
        this.cancelledQty = cancelledQty;
        this.jobReGenQty = jobReGenQty;
    }
}

export class SPS_R_JobDepBundlesModel {
    procType: ProcessTypeEnum;
    itemSku: string;
    subProcName: string;
    bundles: SPS_R_JobBundles[];

    constructor(
        procType: ProcessTypeEnum,
        itemSku: string,
        subProcName: string,
        bundles: SPS_R_JobBundles[]
    ) {
        this.procType = procType;
        this.itemSku = itemSku;
        this.subProcName = subProcName;
        this.bundles = bundles;
    }
}


export class SPS_R_JobDepOpSkuInfo {
    depProcType: ProcessTypeEnum;
    depSubProcess: string;
    itemSku: string;
    fromInventory: boolean;
    issuedQty: number;
    requestedQty: number;
    color: string;
    size: string;

    constructor(
        depProcType: ProcessTypeEnum,
        depSubProcess: string,
        itemSku: string,
        fromInventory: boolean,
        issuedQty: number,
        requestedQty: number,
        color: string,
        size: string
    ) {
        this.depProcType = depProcType;
        this.depSubProcess = depSubProcess;
        this.itemSku = itemSku;
        this.fromInventory = fromInventory;
        this.issuedQty = issuedQty;
        this.requestedQty = requestedQty;
        this.color = color;
        this.size = size;
    }
}

// map<number, {color: string, size: string}>();

export class SPS_R_JobColorSizeModel {
    color: string;
    size: string;
    quantity: number;
    pslIds: number[]; // 4

    constructor(color: string, size: string, quantity: number, pslIds: number[]) {
        this.color = color;
        this.size = size;
        this.quantity = quantity;
        this.pslIds = pslIds;
    }
}



// when the attributes for bundles are asked, get those info from the OMS based on the pslb id
export class SPS_R_JobBundles {
    bunBrcd: string;
    qty: number;
    pslId: number;

    constructor(bunBrcd: string, qty: number, pslId: number) {
        this.bunBrcd = bunBrcd;
        this.qty = qty;
        this.pslId = pslId;
    }
}


export class SPS_R_ProcJobTrimsModel {
    itemCode: string;
    itemDesc: string;
    itemType: PhItemCategoryEnum;
    itemName: string;
    cons: number; // per piece
    requiredQty: number;
    issuedQty: number;
    lastIssuedOn: string;
    issuedBy: string;
    uom: string;
    allocatedQty: number;
    constructor(
        itemCode: string,
        itemDesc: string,
        itemType: PhItemCategoryEnum,
        itemName: string,
        cons: number,
        requiredQty: number,
        issuedQty: number,
        lastIssuedOn: string,
        issuedBy: string,
        uom: string,
        allocatedQty: number
    ) {
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.itemType = itemType;
        this.itemName = itemName;
        this.cons = cons;
        this.requiredQty = requiredQty;
        this.issuedQty = issuedQty;
        this.lastIssuedOn = lastIssuedOn;
        this.issuedBy = issuedBy;
        this.uom = uom;
        this.allocatedQty = allocatedQty;
    }
}


export class SPS_R_JobFeaturesModel {
    style: string;
    color: string[];
    delDate: string[];
    vpo: string[];
    soNo: string[];
    destination: string[];
    soLineNo: string[];
    buyer: string[];

    constructor(
        style: string,
        color: string[],
        delDate: string[],
        vpo: string[],
        soNo: string[],
        destination: string[],
        soLineNo: string[],
        buyer: string[]
    ) {
        this.style = style;
        this.color = color;
        this.delDate = delDate;
        this.vpo = vpo;
        this.soNo = soNo;
        this.destination = destination;
        this.soLineNo = soLineNo;
        this.buyer = buyer;
    }
}



export class SPS_R_JobInfoDetailedResponse extends GlobalResponseObject {
    data?: SPS_R_ProcJobInfoModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: SPS_R_ProcJobInfoModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



