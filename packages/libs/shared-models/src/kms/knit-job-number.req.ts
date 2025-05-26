import { CommonRequestAttrs } from "../common";

export class KnitJobNumberRequest extends CommonRequestAttrs {
    knitJobNumber: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitJobNumber: string,
    ) {
        super(username, unitCode, companyCode, userId)
        this.knitJobNumber = knitJobNumber
    }
}