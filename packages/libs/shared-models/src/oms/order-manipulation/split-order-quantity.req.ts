import { CommonRequestAttrs } from "../../common";

export class SplitOrderQuantityRequest extends CommonRequestAttrs {
    orderId: number;
    orderNo: string;
    orderLineId: number;
    quantity: number;
    orderLineNo: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderId: number,
        orderNo: string,
        orderLineId: number,
        quantity: number,
        orderLineNo: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderId = orderId;
        this.orderNo = orderNo;
        this.orderLineId = orderLineId;
        this.quantity = quantity;
        this.orderLineNo = orderLineNo;
    }
}


export class SplitSaleOrderQuantityRequest extends CommonRequestAttrs {
    saleOrderNumber: string;
    saleOrderItemQty: number;
    saleOrderItemCode: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderNumber: string,
        saleOrderItemQty: number,
        saleOrderItemCode: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.saleOrderNumber = saleOrderNumber;
        this.saleOrderItemQty = saleOrderItemQty;
        this.saleOrderItemCode = saleOrderItemCode;
    }
}
