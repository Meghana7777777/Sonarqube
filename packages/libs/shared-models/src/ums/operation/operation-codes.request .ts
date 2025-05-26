import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum, OpFormEnum } from "../../oms";

export class OperationCodesRequest extends CommonRequestAttrs {
    opCode: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        opCode: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.opCode = opCode;
    }
}