import { CommonRequestAttrs } from "../../../../common";

export class ModuleIdRequest extends CommonRequestAttrs {
    id?: number;
    moduleCode?: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        moduleCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.moduleCode = moduleCode;
    }
}