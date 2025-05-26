import { CommonRequestAttrs } from "../../common";

export class FgWhHeaderIdReqDto extends CommonRequestAttrs {
    fgWhHeaderId: number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        fgWhHeaderId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.fgWhHeaderId = fgWhHeaderId;
    }
}