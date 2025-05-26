import { RawOrderLineRmModel } from "./item-info/raw-order-line-rm.model";

export class RawOrderSubLineInfoModel {
    orderLineId: number;
    orderSubLineId: number;
    orderSubLineNo: string// the main ref for the order-sub-line that is unique. it could be anything (sale order/purchase order)
    productCode: string;
    fgColor: string;
    size: string;
    quantity: number;
    schedule: string;
    extSysRefNo: string; // usually the main ref no with the external systems
    rmInfo: RawOrderLineRmModel[]; // this will have the item-sub-line(size, destination) specifc RM props. For complete RM props -> refer the line specific RM info with iCode as a bridge
    operationCodes: string[];

    constructor(
        orderLineId: number,
        orderSubLineId: number,
        orderSubLineNo: string,
        productCode: string,
        fgColor: string,
        size: string,
        quantity: number,
        schedule: string,
        extSysRefNo: string,
        rmInfo: RawOrderLineRmModel[],
        operationCodes: string[]
    ) {
        this.orderLineId = orderLineId;
        this.orderSubLineId = orderSubLineId;
        this.orderSubLineNo = orderSubLineNo;
        this.productCode = productCode
        this.fgColor = fgColor;
        this.size = size;
        this.quantity = quantity;
        this.schedule = schedule;
        this.extSysRefNo = extSysRefNo;
        this.rmInfo = rmInfo;
        this.operationCodes = operationCodes;
    }
}

