import { CommonRequestAttrs } from "../../common";

export class PKMSFgWhReqIdDto extends CommonRequestAttrs {
    fgWhRequestId: number;
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number, fgWhRequestId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.fgWhRequestId = fgWhRequestId;
    }

}