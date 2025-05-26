import { CommonRequestAttrs } from "../../../common";

export class OrderLineRequest extends CommonRequestAttrs {
    orderRefNo: string;
    orderLineRefNo: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderRefNo: string,
        orderLineRefNo: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderRefNo = orderRefNo;
        this.orderLineRefNo = orderLineRefNo;
    }
}