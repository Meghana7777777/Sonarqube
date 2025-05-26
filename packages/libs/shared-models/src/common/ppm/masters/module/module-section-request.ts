import { CommonRequestAttrs } from "../../../../common";

export class ModuleSectionRequest extends CommonRequestAttrs {
   
    sectionCode: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        sectionCode: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.sectionCode = sectionCode;
    }
}