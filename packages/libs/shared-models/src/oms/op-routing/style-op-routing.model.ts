// FG SKU = 'style + prodName + color';
import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { BomItemTypeEnum } from "../../common/enums";
import { ProcessTypeEnum } from "../enum";

export class MOP_OpRoutingModel {
    versionId: number;
    version: string;
    desc: string;
    style: string;
    productType: string;
    processTypesList: MOP_OpRoutingProcessTypeList[];

    /**
     * Constructor for MOP_OpRoutingModel
     * @param version - Version of the operation routing
     * @param desc - Description of the operation routing
     * @param style - Style code
     * @param productType - Type of product
     * @param processTypesList - List of process types
     */
    constructor(
        versionId: number,
        version: string,
        desc: string,
        style: string,
        productType: string,
        processTypesList: MOP_OpRoutingProcessTypeList[]
    ) {
        this.versionId = versionId;
        this.version = version;
        this.desc = desc;
        this.style = style;
        this.productType = productType;
        this.processTypesList = processTypesList;
    }
}


export class MOP_OpRoutingCompsList {
    compName: string;
    compDesc: string;
    embDetails: PanelEmbDetailsModel[]

    /**
     * Constructor for MOP_OpRoutingCompsList
     * @param compName - Component name
     * @param compDesc - Component description
     */
    constructor(compName: string, compDesc: string, embDetails: PanelEmbDetailsModel[]) {
        this.compName = compName;
        this.compDesc = compDesc;
        this.embDetails = embDetails;
    }
}

export class PanelEmbDetailsModel {
    operationCode: string;
    constructor(operationCode: string) {
        this.operationCode = operationCode;
    }
}


export class MOP_OpRoutingOpsList {
    opCode: string;
    opName: string;
    opOrder: number;
    smv: number;
    processType: ProcessTypeEnum;
    opGroup: string;

    /**
     * Constructor for MOP_OpRoutingOpsList
     * @param opCode - Operation code
     * @param opName - Operation name
     * @param opOrder - Order of the operation
     * @param smv - Standard Minute Value (SMV)
     * @param processType - Type of process
     */
    constructor(
        opCode: string,
        opName: string,
        opOrder: number,
        smv: number,
        processType: ProcessTypeEnum,
        opGroup: string
    ) {
        this.opCode = opCode;
        this.opName = opName;
        this.opOrder = opOrder;
        this.smv = smv;
        this.processType = processType;
        this.opGroup = opGroup;
    }
}



export class MOP_OpRoutingBomList {
    bomItemCode: string;
    bomItemDesc: string;
    // itemType: RmItemTypeEnum;
    bomItemType: BomItemTypeEnum;
    isThisAPreOpOutput: boolean;

    /**
     * Constructor for MOP_OpRoutingBomList
     * @param bomItemCode - The unique code for the BOM item
     * @param bomItemDesc - Description of the BOM item
     * @param bomItemType - Type of the BOM item
     * @param isThisAPreOpOutput - Indicates if this item is an output of a pre-operation
     */
    constructor(
        bomItemCode: string,
        bomItemDesc: string,
        bomItemType: BomItemTypeEnum,
        isThisAPreOpOutput: boolean
    ) {
        this.bomItemCode = bomItemCode;
        this.bomItemDesc = bomItemDesc;
        this.bomItemType = bomItemType;
        this.isThisAPreOpOutput = isThisAPreOpOutput;
    }
}


export class MOP_OpRoutingSubProcessList {
    processType: ProcessTypeEnum;
    subProcessName: string;
    order: number;
    bomList: MOP_OpRoutingBomList[];
    operations: MOP_OpRoutingOpsList[];
    dependentSubProcesses : string[];
    outPutSku: string;
    components?: MOP_OpRoutingCompsList[]; // only applicable for knit process type


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
        bomList: MOP_OpRoutingBomList[],
        dependentSubProcesses : string[],
        operations: MOP_OpRoutingOpsList[],
        order: number,
        outPutSku: string,
        components?: MOP_OpRoutingCompsList[],

    ) {
        this.processType = processType;
        this.subProcessName = subProcessName;
        this.bomList = bomList;

        this.dependentSubProcesses = dependentSubProcesses;
        this.operations = operations;
        this.order = order;
        this.outPutSku = outPutSku;
        this.components = components;
    }
}


export class MOP_OpRoutingProcessTypeList {
    processType: ProcessTypeEnum;
    processOrder: number;
    depProcessType: string[];
    routingGroup: string;
    bundleQuantity: number;
    isBundlingOps: boolean;
    isOperatorLevelTracking: boolean;
    isInventoryItem: boolean;
    subProcessList: MOP_OpRoutingSubProcessList[];
    outPutBundleQty: number

    /**
     * Constructor for MOP_OpRoutingProcessTypeList
     * @param processType - The main process type
     * @param processOrder - Order of the process in the routing
     * @param depProcessType - List of dependent process types
     * @param subProcessList - List of subprocesses
     */
    constructor(
        processType: ProcessTypeEnum,
        processOrder: number,
        depProcessType: string[],
        routingGroup: string,
        bundleQuantity: number,
        subProcessList: MOP_OpRoutingSubProcessList[],
        isBundlingOps: boolean,
        isOperatorLevelTracking: boolean,
        isInventoryItem: boolean,
        outPutBundleQty: number
    ) {
        this.processType = processType;
        this.processOrder = processOrder;
        this.depProcessType = depProcessType;
        this.routingGroup = routingGroup;
        this.bundleQuantity = bundleQuantity;
        this.subProcessList = subProcessList;
        this.isBundlingOps = isBundlingOps;
        this.isOperatorLevelTracking = isOperatorLevelTracking;
        this.isInventoryItem = isInventoryItem;
        this.outPutBundleQty = outPutBundleQty
    }
}


export class MoP_OpRoutingResponse extends GlobalResponseObject {
    data?: MOP_OpRoutingModel[];

    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     * @param data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: MOP_OpRoutingModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class MoP_OpRoutingProcessTypeResponse extends GlobalResponseObject {
    data?: MOP_OpRoutingProcessTypeList[];

    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     * @param data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: MOP_OpRoutingProcessTypeList[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class MOP_OpRoutingRetrievalRequest extends CommonRequestAttrs{
    style: string;
    productType: string;
    versionId: number;
    iNeedOps: boolean;
    iNeedBom: boolean;
    // Constructor to initialize the properties
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: string,
        productType: string,
        versionId: number,
        iNeedOps: boolean,
        iNeedBom: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.style = style;
        this.productType = productType;
        this.versionId = versionId;
        this.iNeedOps = iNeedOps;
        this.iNeedBom = iNeedBom;
    }
}


export class MOP_OpRoutingVersionRequest extends CommonRequestAttrs {
    version: string;
    desc: string;
    style: string;
    productType: string;
    processTypesList: MOP_OpRoutingProcessTypeList[];

    /**
     * Constructor for MOP_OpRoutingVersionRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID of the requester
     * @param version - Version of the routing
     * @param desc - Description of the routing version
     * @param style - Style code
     * @param productType - Type of the product
     * @param processTypesList - List of process types in the routing
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        version: string,
        desc: string,
        style: string,
        productType: string,
        processTypesList: MOP_OpRoutingProcessTypeList[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.version = version;
        this.desc = desc;
        this.style = style;
        this.productType = productType;
        this.processTypesList = processTypesList;
    }
}
