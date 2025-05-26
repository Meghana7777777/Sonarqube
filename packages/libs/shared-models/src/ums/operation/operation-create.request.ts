import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum, OpFormEnum } from "../../oms";

export class OperationCreateRequest extends CommonRequestAttrs {
    id?:number;
    iOpCode: string;
    eOpCode: string;
    opCategroy: ProcessTypeEnum;
    opForm: OpFormEnum;
    opName: string;
    machineName: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id:number,
        iOpCode: string,
        eOpCode: string,
        opCategroy: ProcessTypeEnum,
        opForm: OpFormEnum,
        opName: string,
        machineName: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.id=id;
        this.opCategroy = opCategroy;
        this.opForm = opForm;
        this.iOpCode = iOpCode;
        this.eOpCode = eOpCode;
        this.opName = opName;
        this.machineName = machineName;
    }
}