import { CommonRequestAttrs } from "../../common";


export class SectionCodeRequest extends CommonRequestAttrs {
    secCode : string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, secCode:string)
     {
        super(username, unitCode, companyCode, userId);
        this.secCode = secCode;
    }
}

