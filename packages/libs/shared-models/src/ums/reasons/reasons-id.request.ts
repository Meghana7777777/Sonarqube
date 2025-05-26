import { CommonRequestAttrs } from "../../common";

export class ReasonIdRequest extends CommonRequestAttrs {
    reasonId: number; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reasonId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.reasonId = reasonId;
    }
}

