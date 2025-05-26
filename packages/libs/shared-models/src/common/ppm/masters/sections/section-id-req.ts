import { CommonRequestAttrs } from "../../../../common";

export class SectionIdRequest extends CommonRequestAttrs {
    id?: number;
    secCode?: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        secCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.secCode = secCode;
    }
}