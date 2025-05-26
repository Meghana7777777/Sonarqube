import { BomItemTypeEnum, ProcessTypeEnum, MOP_OpRoutingCompsList, MOP_OpRoutingOpsList } from "@xpparel/shared-models";

export interface ISelectedSubProcess {
    bomList: IMOP_OpRoutingBomList[];
    index: number;
    subProcessList: IMOP_OpRoutingSubProcessList;
    processType: ProcessTypeEnum;
    processTypeName: string;

}
export interface IProcessTypeInfo {
    processType: ProcessTypeEnum;
    processOrder: number;
    depProcessType: string[];
    subProcessList: IMOP_OpRoutingSubProcessList[];
    allOperations: MOP_OpRoutingOpsList[];
    allBomInfo: IMOP_OpRoutingBomList[];
    outPut: string[];
    extraOperations: string[];
    extraProcessTypes: string[];
    isProcessTypeNotExist: boolean;

}
export interface IMOP_OpRoutingSubProcessList {
    processType: ProcessTypeEnum;
    subProcessName: string;
    order: number;
    bomList: IMOP_OpRoutingBomList[];
    operations: MOP_OpRoutingOpsList[];
    dependentSubProcesses: string[];
    components?: MOP_OpRoutingCompsList[];
    selectedBom: IMOP_OpRoutingBomList[]
}
export interface IMOP_OpRoutingBomList {
    bomItemCode: string;
    bomItemDesc: string;
    // itemType: RmItemTypeEnum;
    bomItemType: BomItemTypeEnum;
    isThisAPreOpOutput: boolean;
    avgCons?: number;
    seq?: number;

}