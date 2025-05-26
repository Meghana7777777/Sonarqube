import { CommonRequestAttrs, GlobalResponseObject } from "../../common";

export class ProductIdRequest extends CommonRequestAttrs {
    prodId: number;
    subProdId?: number;
    orderNo?: string;
    orderId?: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        prodId: number,
        subProdId?: number,
        orderNo?: string,
        orderId?: number,
    

    ) {
        super(username, unitCode, companyCode, userId);
        this.prodId = prodId;
        this.subProdId = subProdId;
        this.orderNo = orderNo;
        this.orderId = orderId;
    }
}