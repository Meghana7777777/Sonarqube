import { CommonRequestAttrs } from "../../common";

// export class DeleteSplitQuantityRequest extends CommonRequestAttrs {
//     orderId: number;
//     orderNo: string;
//     orderLineId: number;
//     orderLineNo: string;
//     constructor(
//         username: string,
//         unitCode: string,
//         companyCode: string,
//         userId: number,
//         orderId: number,
//         orderNo: string,
//         orderLineId: number,
//         orderLineNo: string
//     ) {
//         super(username, unitCode, companyCode, userId);
//         this.orderId = orderId;
//         this.orderNo = orderNo;
//         this.orderLineId = orderLineId;
//         this.orderLineNo = orderLineNo;
//     }
// }


// export class ParentIdRequest { 
//     parentId : number;
//     constructor(parentId : number){
//         this.parentId = parentId
//     }
// }

export class DeleteManufacturingOrderSplitQuantityRequest extends CommonRequestAttrs {
    manufacturingOrderNumber: string;
    manufacturingOrderItemCode: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderNumber: string,    
        manufacturingOrderItemCode: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderNumber = manufacturingOrderNumber;
        this.manufacturingOrderItemCode = manufacturingOrderItemCode;
    }
}
