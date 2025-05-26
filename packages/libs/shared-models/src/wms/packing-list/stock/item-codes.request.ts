import { CommonRequestAttrs } from "../../../common";

export class StockCodesRequest extends CommonRequestAttrs {
    itemCode: string;
    lotNumbers: string[];
    batchNumbers: string[];
    manufacturingOrderCode: string[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, itemCode:string, lotNumbers:string[], batchNumbers:string[], manufacturingOrderCode: string[]) {
        super(username, unitCode, companyCode, userId);
        this.itemCode = itemCode;
        this.lotNumbers = lotNumbers;
        this.batchNumbers = batchNumbers;
        this.manufacturingOrderCode = manufacturingOrderCode;
    }
}