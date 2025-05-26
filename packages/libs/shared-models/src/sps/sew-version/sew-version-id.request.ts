import { CommonRequestAttrs } from "../../common";

export class SewVerIdRequest extends CommonRequestAttrs {
    
    opVerId: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        opVerId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.opVerId = opVerId;
    }
}