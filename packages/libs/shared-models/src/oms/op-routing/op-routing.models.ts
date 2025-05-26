// FG SKU = 'style + prodName + color';
import { BomItemTypeEnum, CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../common";
import { ProcessTypeEnum } from "../enum";
import { PanelEmbDetailsModel } from "./style-op-routing.model";

export class MOC_OpRoutingModel {
    version: string;
    desc: string;
    style: string;
    fgColor: string;
    prodName: string;
    fgSku: string; // style+product type+color
    processTypesList: MOC_OpRoutingProcessTypeList[];

    constructor(
        version: string,
        desc: string,
        style: string,
        fgColor: string,
        prodName: string,
        fgSku: string,
        processTypesList: MOC_OpRoutingProcessTypeList[]
    ) {
        this.version = version;
        this.desc = desc;
        this.style = style;
        this.fgColor = fgColor;
        this.prodName = prodName;
        this.fgSku = fgSku;
        this.processTypesList = processTypesList;
    }
}

export class MOC_OpRoutingCompsList {
    compName: string;
    compDesc: string;
    embDetails: PanelEmbDetailsModel[]
    constructor(compName: string, compDesc: string, embDetails: PanelEmbDetailsModel[]) {
        this.compName = compName;
        this.compDesc = compDesc;
        this.embDetails = embDetails;
    }
}


export class MOC_OpRoutingOpsList {
    opCode: string;
    opName: string;
    opOrder: number;
    smv: number;
    processType: ProcessTypeEnum;
    opGroup: string;

    constructor(opCode: string, opName: string, opOrder: number, smv: number, processType: ProcessTypeEnum, opGroup: string) {
        this.opCode = opCode;
        this.opName = opName;
        this.opOrder = opOrder;
        this.smv = smv;
        this.processType = processType;
        this.opGroup = opGroup;
    }
}

export class MOC_OpRoutingBomList {
    bomItemCode: string;
    bomItemDesc: string;
    bomItemName: string;
    itemType: PhItemCategoryEnum;
    bomItemType: BomItemTypeEnum;
    isThisAPreOpOutput: boolean;
    consumption: number;

    constructor(bomItemCode: string, bomItemDesc: string, bomItemName: string, itemType: PhItemCategoryEnum, bomItemType: BomItemTypeEnum, isThisAPreOpOutput: boolean, consumption: number) {
        this.bomItemCode = bomItemCode;
        this.bomItemDesc = bomItemDesc;
        this.bomItemName = bomItemName;
        this.itemType = itemType;
        this.bomItemType = bomItemType;
        this.isThisAPreOpOutput = isThisAPreOpOutput;
        this.consumption = consumption;
    }
}

export class MOC_OpRoutingSubProcessList {
    processType: ProcessTypeEnum;
    subProcessName: string; // Its equal to a knit group for the processing type KNIT
    order: number;
    bomList: MOC_OpRoutingBomList[];
    operations: MOC_OpRoutingOpsList[];
    dependentSubProcesses: MOC_SubProcessAndProcessTypeModel[];
    outPutSku: string;
    isRequestNeeded: boolean;
    components?: MOC_OpRoutingCompsList[]; // only applicable for knit process type


    /**
         * Constructor for MOP_OpRoutingSubProcessList
         * @param processType - The main process type
         * @param subProcessName - Name of the subprocess
         * @param bomList - List of Bill of Materials (BOM) items
         * @param operations - List of operations in the subprocess
         * @param components - Optional list of components (only applicable for knit process type)
         */
    constructor(
        processType: ProcessTypeEnum,
        subProcessName: string,
        bomList: MOC_OpRoutingBomList[],
        dependentSubProcesses: MOC_SubProcessAndProcessTypeModel[],
        operations: MOC_OpRoutingOpsList[],
        order: number,
        outPutSku: string,
        isRequestNeeded: boolean,
        components?: MOC_OpRoutingCompsList[],

    ) {
        this.processType = processType;
        this.subProcessName = subProcessName;
        this.bomList = bomList;

        this.dependentSubProcesses = dependentSubProcesses;
        this.operations = operations;
        this.order = order;
        this.outPutSku = outPutSku;
        this.isRequestNeeded = isRequestNeeded
        this.components = components;
    }
}

export class MOC_SubProcessAndProcessTypeModel {
    subProcessName: string;
    processesType: ProcessTypeEnum;
    itemSku: string;

    constructor(subProcessName: string, processesType: ProcessTypeEnum, itemSku: string) {
        this.subProcessName = subProcessName;
        this.processesType = processesType;
        this.itemSku = itemSku;
    }
}


export class MOC_OpRoutingProcessTypeList {
    processType: ProcessTypeEnum;
    procesMorder: number;
    depProcessType: string[];
    subProcessList: MOC_OpRoutingSubProcessList[];
    routingGroup: string;
    bundleQty: number;
    isBundlingOps: boolean;
    isOperatorLevelTracking: boolean;
    isInventoryItem: boolean;
    outPutBundleQty: number;
    outputFgSku: string;
    constructor(
        processType: ProcessTypeEnum,
        procesMorder: number,
        depProcessType: string[],
        subProcessList: MOC_OpRoutingSubProcessList[],
        routingGroup: string,
        bundleQty: number,
        isBundlingOps: boolean,
        isOperatorLevelTracking: boolean,
        isInventoryItem: boolean,
        outPutBundleQty: number,
        outputFgSku: string
    ) {
        this.processType = processType;
        this.procesMorder = procesMorder;
        this.depProcessType = depProcessType;
        this.subProcessList = subProcessList;
        this.routingGroup = routingGroup;
        this.bundleQty = bundleQty;
        this.isBundlingOps = isBundlingOps;
        this.isOperatorLevelTracking = isOperatorLevelTracking;
        this.isInventoryItem = isInventoryItem;
        this.outPutBundleQty = outPutBundleQty;
        this.outputFgSku = outputFgSku;
    }
}

export class MOC_OpRoutingResponse extends GlobalResponseObject {
    data?: MOC_OpRoutingModel[];

    /**
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message
     * @param data - Optional MOC_OpRoutingModel data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: MOC_OpRoutingModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class MOC_OpRoutingProcessTypeResponse extends GlobalResponseObject {
    data?: MOC_OpRoutingProcessTypeList[];

    /**
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message
     * @param data - Optional MOC_OpRoutingProcessTypeList data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: MOC_OpRoutingProcessTypeList[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class MOC_OpRoutingRetrievalRequest extends CommonRequestAttrs {
    moNumber: string;
    styleCode: string;
    productCode: string; // mandatory only 1 product name
    fgColor: string; // 1 color only
    iNeedOps: boolean;
    iNeedBom: boolean;

    /**
     * @param username - User making the request
     * @param unitCode - Unit identifier
     * @param companyCode - Company identifier
     * @param userId - User ID
     * @param moNumber - Manufacturing Order Number
     * @param styleCode - Style Code of the product
     * @param productCode - Mandatory, only 1 product name
     * @param fgColor - Only 1 color
     * @param iNeedOps - Whether operations data is needed
     * @param iNeedBom - Whether BOM data is needed
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moNumber: string,
        styleCode: string,
        productCode: string,
        fgColor: string,
        iNeedOps: boolean,
        iNeedBom: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.styleCode = styleCode;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.iNeedOps = iNeedOps;
        this.iNeedBom = iNeedBom;
    }
}



export class MOCProductFgColorVersionRequest extends CommonRequestAttrs {
    versionId: number;
    styleCode: string;
    productCode: string;
    fgColor: string;
    productType: string;
    moNumber: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        versionId: number,
        styleCode: string,
        productCode: string,
        fgColor: string,
        productType: string,
        moNumber: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.versionId = versionId;
        this.styleCode = styleCode;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.productType = productType;
        this.moNumber = moNumber;
    }
}
