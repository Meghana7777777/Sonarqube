import { CommonRequestAttrs } from "../common";

export class PslIdsRequest extends CommonRequestAttrs {
    pslIds: string[] = []
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        pslIds: string[],
    ) {
        super(username, unitCode, companyCode, userId)
        this.pslIds = pslIds
    }
}