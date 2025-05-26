import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum, OpFormEnum } from "../../oms";

export class OperationModel {
    opCode: string;
    opName: string;
    eOpCode: string;
    opCategory: ProcessTypeEnum;
    opForm: OpFormEnum;
    opSeq: number;
    group: string;
    smv ?: number; // will be given during the op version retrieval
    machineName?: string;

    constructor(
        opCode: string,
        eOpCode: string,
        opCategory: ProcessTypeEnum,
        opForm: OpFormEnum,
        opName: string,
        opSeq: number,
        group: string,
        smv?: number,
        machineName?: string
    ) {
        this.opCategory = opCategory;
        this.eOpCode = eOpCode;
        this.opForm = opForm;
        this.opCode = opCode;
        this.opName = opName;
        this.opSeq = opSeq;
        this.group = group;
        this.smv = smv;
        this.machineName = machineName;
    }
}