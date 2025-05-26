import { CommonRequestAttrs } from "../../../common";

export class OrderLinesRequest extends CommonRequestAttrs {
    orderRefNos: string;
    orderLineRefNo: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderRefNos: string,
        orderLineRefNo: string[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderRefNos = orderRefNos;
        this.orderLineRefNo = orderLineRefNo;
    }
}