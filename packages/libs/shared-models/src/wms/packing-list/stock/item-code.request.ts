import { CommonRequestAttrs } from "../../../common";

export class ItemCodeRequest extends CommonRequestAttrs {
    itemCode: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, itemCode: string) {
        super(username, unitCode, companyCode, userId);
        this.itemCode = itemCode;
    }
}