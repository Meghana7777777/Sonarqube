import { CommonRequestAttrs } from "../../../../common";

export class WorkstationModuleRequest extends CommonRequestAttrs {
   
    moduleCode: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moduleCode: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.moduleCode = moduleCode;
    }
}