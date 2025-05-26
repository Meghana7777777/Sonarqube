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