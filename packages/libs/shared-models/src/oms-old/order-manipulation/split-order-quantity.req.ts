import { CommonRequestAttrs } from "../../common";

// export class SplitOrderQuantityRequest extends CommonRequestAttrs {
//     orderId: number;
//     orderNo: string;
//     orderLineId: number;
//     quantity: number;
//     orderLineNo: string;
//     constructor(
//         username: string,
//         unitCode: string,
//         companyCode: string,
//         userId: number,
//         orderId: number,
//         orderNo: string,
//         orderLineId: number,
//         quantity: number,
//         orderLineNo: string
//     ) {
//         super(username, unitCode, companyCode, userId);
//         this.orderId = orderId;
//         this.orderNo = orderNo;
//         this.orderLineId = orderLineId;
//         this.quantity = quantity;
//         this.orderLineNo = orderLineNo;
//     }
// }


export class SplitManufacturingOrderQuantityRequest extends CommonRequestAttrs {
    manufacturingOrderNumber: string;
    manufacturingOrderItemQty: number;
    manufacturingOrderItemCode: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderNumber: string,
        manufacturingOrderItemQty: number,
        manufacturingOrderItemCode: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderNumber = manufacturingOrderNumber;
        this.manufacturingOrderItemQty = manufacturingOrderItemQty;
        this.manufacturingOrderItemCode = manufacturingOrderItemCode;
    }
}
