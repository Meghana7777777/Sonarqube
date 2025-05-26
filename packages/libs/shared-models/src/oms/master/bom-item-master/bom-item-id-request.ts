import { CommonRequestAttrs } from "../../../common";

export class ItemIdRequest extends CommonRequestAttrs {
    id?: number;
    itemName?: string;
    itemCode?: string;

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
        itemName?: string,
        itemCode?: string

    ) {
        super(userName, unitCode, companyCode, userId);
        this.id = id;
        this.itemName = itemName;
        this.itemCode = itemCode;
    }
}