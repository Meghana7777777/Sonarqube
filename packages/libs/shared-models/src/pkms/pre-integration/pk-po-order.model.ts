import { PKPoLineModel } from "./pk-po-line.model";

export class PKPoOrderModel {
    poNumber: string;
    poDate: string;
    qty: number;
    pOrderLines: PKPoLineModel[];
    constructor(
        poNumber: string,
        poDate: string,
        qty: number,
        pOrderLines: PKPoLineModel[]
    ) {
        this.poNumber = poNumber;
        this.poDate = poDate;
        this.qty = qty;
        this.pOrderLines = pOrderLines;
    }
}