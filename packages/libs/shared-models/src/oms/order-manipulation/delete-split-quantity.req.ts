import { CommonRequestAttrs } from "../../common";

export class DeleteSplitQuantityRequest extends CommonRequestAttrs {
    orderId: number;
    orderNo: string;
    orderLineId: number;
    orderLineNo: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderId: number,
        orderNo: string,
        orderLineId: number,
        orderLineNo: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderId = orderId;
        this.orderNo = orderNo;
        this.orderLineId = orderLineId;
        this.orderLineNo = orderLineNo;
    }
}


export class ParentIdRequest { 
    parentId : number;
    constructor(parentId : number){
        this.parentId = parentId
    }
}

export class DeleteSaleOrderSplitQuantityRequest extends CommonRequestAttrs {
    saleOrderNumber: string;
    saleOrderItemCode: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderNumber: string,    
        saleOrderItemCode: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.saleOrderNumber = saleOrderNumber;
        this.saleOrderItemCode = saleOrderItemCode;
    }
}
