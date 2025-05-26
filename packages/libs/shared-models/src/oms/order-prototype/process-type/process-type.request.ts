import { CommonRequestAttrs } from "../../../common";
import { ProcessTypeModel } from "./process-type.model";

export class ProcessTypeRequest extends CommonRequestAttrs{
    processtype: ProcessTypeModel
    
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processtype: ProcessTypeModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.processtype = processtype;
    }
}