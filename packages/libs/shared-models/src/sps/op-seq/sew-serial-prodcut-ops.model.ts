import { ProcessTypeEnum, OpFormEnum } from "../../oms";

export class SewSerialProductOpsModel {
    prodName: string;
    ops: SewSerialProductOpModel[];
}


export class SewSerialProductOpModel {
    opCode: string;
    jg: number;
    depJg: string; // csv
    opCategory: ProcessTypeEnum;
    opForn: OpFormEnum;
    components: string; // csv
    opOrder: number;
    opName: string;
    prodName: string;
    smv: number;
}