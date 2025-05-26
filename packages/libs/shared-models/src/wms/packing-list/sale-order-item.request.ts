import { CommonRequestAttrs } from "../../common";


export class SaleOrderItemRequest extends CommonRequestAttrs {
    saleOrderCode: string;
    itemCode: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderCode: string,
        itemCode: string[]
    ) {
        super(username, unitCode, companyCode, userId)
        this.saleOrderCode = saleOrderCode;
        this.itemCode = itemCode;
    }
}

export class PhItemLinesIdRequest extends CommonRequestAttrs {
    phItemLinesId: number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        phItemLinesId: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.phItemLinesId = phItemLinesId;
    }
}