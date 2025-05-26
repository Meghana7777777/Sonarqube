import { CommonRequestAttrs } from "../../common";

export class SJobTrimsItemsRequest extends CommonRequestAttrs{
    id: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, sJobTrimGroupId: number) {
        super(username, unitCode, companyCode, userId);
        this.id = sJobTrimGroupId;
    }
}