import { CommonRequestAttrs } from "../../../common";

export class SaleOrderListRequest extends CommonRequestAttrs{
    saleOrderList: string[];
   
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderList: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.saleOrderList = saleOrderList;
    }
}

export class OrderNoRequest extends CommonRequestAttrs{
    orderNos: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderNos: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.orderNos = orderNos;
    }
}
