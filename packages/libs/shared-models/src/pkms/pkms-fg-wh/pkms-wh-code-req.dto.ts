import { CommonRequestAttrs } from "../../common";

export class PKMSWhCodeReqDto extends CommonRequestAttrs {
    whCode: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        whCode: string

    ) {
        super(username, unitCode, companyCode, userId);
        this.whCode = whCode;
    }
}