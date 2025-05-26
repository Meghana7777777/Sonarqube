
import { CommonRequestAttrs } from "../../common";

export class OrderNumbersRequest extends CommonRequestAttrs {
    orderNo: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderNo: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderNo = orderNo;
    }
}
