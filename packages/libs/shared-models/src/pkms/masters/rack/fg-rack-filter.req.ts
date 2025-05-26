import { CommonRequestAttrs } from "../../../common";

export class FgRackFilterRequest extends CommonRequestAttrs {
    whId: number;
    constructor(
        companyCode: string,
        unitCode: string,
        username: string,
        userId: number,
        whId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.whId = whId
    }
}