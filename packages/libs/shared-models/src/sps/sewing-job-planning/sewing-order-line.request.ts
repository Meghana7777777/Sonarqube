import { CommonRequestAttrs } from "../../common";
export class SewingOrderLineIdRequest extends CommonRequestAttrs{
    mOrderLindId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, mOrderLindId: number) {
        super(username, unitCode, companyCode, userId);
        this.mOrderLindId = mOrderLindId;
    }
}