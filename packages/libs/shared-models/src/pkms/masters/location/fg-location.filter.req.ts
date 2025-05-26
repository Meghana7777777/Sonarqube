import { CommonRequestAttrs } from "../../../common";


export class FgLocationFilterReq extends CommonRequestAttrs {
    whId: number;
    rackId?: number[];
    constructor(
        companyCode: string,
        unitCode: string,
        username: string,
        userId: number,
        whId: number,
        rackId?: number[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.whId = whId;
        this.rackId = rackId;
    }
}
