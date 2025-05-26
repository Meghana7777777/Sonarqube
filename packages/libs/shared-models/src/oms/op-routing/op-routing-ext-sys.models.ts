import { GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../enum";


export class OMS_R_MoOperationsListInfoResponse extends GlobalResponseObject {
    data ?: OMS_R_MoStyleProdColOperationsListModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OMS_R_MoStyleProdColOperationsListModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class OMS_R_MoStyleProdColOperationsListModel {
    moNo: string;
    style: string;
    fgColor: string;
    pName: string;
    pCode: string;
    operations: OMS_R_MoStyleProdColOperationsListOpGroupModel[];

    constructor(
        moNo: string,
        style: string,
        fgColor: string,
        pName: string,
        pCode: string,
        operations: OMS_R_MoStyleProdColOperationsListOpGroupModel[]
    ) {
        this.moNo = moNo;
        this.style = style;
        this.fgColor = fgColor;
        this.pName = pName;
        this.pCode = pCode;
        this.operations = operations;
    }
}

export class OMS_R_MoStyleProdColOperationsListOpGroupModel {
    procType: ProcessTypeEnum;
    procOutPutSku: string; // output sku of the processing type
    subProcName: string;
    subProcOutputSku: string// output sku of the processing type
    opGroup: string;
    depOpGroup: string[]; // array of dep op groups
    routingGroup: string;
    subProcOrder: number;
    opGroupOrder: number;
    operations: OMS_R_MoStyleProdColOperationsListOpModel[];

    constructor(
        procType: ProcessTypeEnum,
        procOutPutSku: string,
        subProcName: string,
        subProcOutputSku: string,
        opGroup: string,
        depOpGroup: string[],
        routingGroup: string,
        subProcOrder: number,
        opGroupOrder: number,
        operations: OMS_R_MoStyleProdColOperationsListOpModel[]
    ) {
        this.procType = procType;
        this.procOutPutSku = procOutPutSku;
        this.subProcName = subProcName;
        this.subProcOutputSku = subProcOutputSku;
        this.opGroup = opGroup;
        this.depOpGroup = depOpGroup;
        this.routingGroup = routingGroup;
        this.operations = operations;
        this.subProcOrder = subProcOrder;
        this.opGroupOrder = opGroupOrder;
    }
}

export class OMS_R_MoStyleProdColOperationsListOpModel {
    opCode: string; 
    smv: number;
    opOrder: number;
    constructor(
        opCode: string,
        smv: number,
        opOrder: number
    ) {
        this.opCode = opCode;
        this.smv = smv;
        this.opOrder = opOrder;
    }
}
