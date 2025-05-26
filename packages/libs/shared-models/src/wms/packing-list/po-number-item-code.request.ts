import { CommonRequestAttrs } from "../../common";

export class PoNumbersItemCodeRequest extends CommonRequestAttrs {
    itemCode: string;
    poNumber: string[];
    constructor(itemCode: string, poNumber: string[], username: string,
        unitCode: string,
        companyCode: string,
        userId: number) {
        super(username, unitCode, companyCode, userId)
        this.itemCode = itemCode;
        this.poNumber = poNumber;
    }
}