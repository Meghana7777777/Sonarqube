import { ComponentModel, OperationModel } from "@xpparel/shared-models";

export interface ITblBasicData {
    key: number;
    // order: number[],
    subProcess: string,
    dependentProcessType: string[];
    dependentSubProcess: string[];
    // components: ComponentModel[],
    selectedComponents: string[],
    // operations: OperationModel[],
    selectedOperations: string[],
    selectedDependentSubProcess: string[];
    selectedDependentProcessType: string[];
    opGroupData:OperationRow[];
    compEmb: IComponentEmb[];
}
export interface ITblData {
    key: number;
    order: number[],
    subProcess: string,
    dependentProcessType: string[];
    dependentSubProcess: string[];
    components: ComponentModel[],
    selectedComponents: string[],
    operations: OperationModel[],
    selectedOperations: string[],
    selectedDependentSubProcess: string[];
    selectedDependentProcessType: string[];
    opGroupData:OperationRow[];
    compEmb: IComponentEmb[];
}

export interface IProcessTypeData {
    [key: string]: IProcessDetails
}
export interface ISavedProcessData {
    processType: string;
    data: ITblBasicData[]
    updateKey: number
}
export interface IProcessDetails {
    processType: string;
    isBundleGroup: boolean;
    bundleQty: number;
    isInventory: boolean;
    isOperatorLevelTracking: boolean;
    tblData: ITblBasicData[];
    isConfirmed: boolean;
    updateKey: number;
}
export interface OperationRoutingTableProps {
    onSave: (data: IProcessDetails) => void;
    onConfirmSequence: (confirmedSequence: boolean) => void;
    processIndex: number;
    savedTableData: IProcessTypeData
    previousTableData: ISavedProcessData[];
    componentsData: ComponentModel[];
    processType: string;
    updateKey: number;
}
export interface OperationRow {
    key: string | number; // Unique key for each row (could be a string or number)
    operation: string;    // The operation name (e.g., Cutting, Stitching)
    opGroup: string;      // The OP Group (e.g., OPG-1, OPG-2)
    opGroupOptions: string;      // The OP Group (e.g., OPG-1, OPG-2)
    opGroupOrder: number;      // The OP Group (e.g., OPG-1, OPG-2)
}
export interface IComponentEmb {
    key: string  // Unique key for each row (could be a string or number)
    operationCodes: string[];    // The operation name (e.g., Cutting, Stitching)
    componentName: string
}