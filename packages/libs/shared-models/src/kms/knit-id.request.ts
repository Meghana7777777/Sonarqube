import { CommonRequestAttrs } from "../common";

export class KnitIdsRequest extends CommonRequestAttrs {
    knitIds: number[]=[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitIds: number[],
    ) {
        super(username, unitCode, companyCode, userId)
        this.knitIds = knitIds
    }
}