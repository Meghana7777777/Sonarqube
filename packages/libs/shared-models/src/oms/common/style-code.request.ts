import { CommonRequestAttrs } from "../../common";

export class StyleCodeRequest extends CommonRequestAttrs {
    styleCode: string

    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number, styleCode: string) {
        super(username, unitCode, companyCode, userId);
        this.styleCode = styleCode;
    }
}


export class CodesRequest extends CommonRequestAttrs {
    Codes: string[]=[]
    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number, Codes:string[]) {
        super(username, unitCode, companyCode, userId);
        this.Codes = Codes;
    }
}