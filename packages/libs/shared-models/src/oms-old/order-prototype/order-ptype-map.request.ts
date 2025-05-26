import { CommonRequestAttrs } from "../../common";

export class OrderPtypeMapRequest extends CommonRequestAttrs {
    orderId: number;
    orderLineId: number;
    productType: string;
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderId: number,
        orderLineId: number,
        productType: string,
        remarks: string,
    

    ) {
        super(username, unitCode, companyCode, userId);
        this.orderId = orderId;
        this.orderLineId = orderLineId;
        this.productType = productType;
        this.remarks = remarks;
    }
}