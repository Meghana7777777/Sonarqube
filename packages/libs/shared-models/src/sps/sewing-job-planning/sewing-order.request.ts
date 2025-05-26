import { CommonRequestAttrs } from "../../common";

export class SewingOrderIdRequest extends CommonRequestAttrs {
    mOrderId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, mOrderId: number) {
        super(username, unitCode, companyCode, userId);
        this.mOrderId = mOrderId;
    }
}