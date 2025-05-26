import { CommonRequestAttrs } from "../../../common";

export class ItemCodesRequest extends CommonRequestAttrs {
    itemCodes: string[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        itemCodes: string[]

    ) {
        super(userName, unitCode, companyCode, userId);
        this.itemCodes = itemCodes;
    }
}