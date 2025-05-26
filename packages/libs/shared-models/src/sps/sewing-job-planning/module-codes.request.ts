import { CommonRequestAttrs } from "../../common";

export class ModuleCodesRequest extends CommonRequestAttrs {
    moduleCodes: string[];
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number, 
        moduleCodes: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.moduleCodes = moduleCodes;
    }
}