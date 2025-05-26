import { CommonRequestAttrs } from "../../common";

export class TrimsItemRequest extends CommonRequestAttrs{
    trimGroupId: number;
    trimItemId: number;
    jobNo: string;
    issuedQuantity: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNo: string,     issuedQuantity: number, trimGroupId: number, trimItemId: number) {
        super(username, unitCode, companyCode, userId);
        this.trimGroupId = trimGroupId;
        this.trimItemId = trimItemId;
        this.jobNo = jobNo;
        this.issuedQuantity = issuedQuantity;
    }
}