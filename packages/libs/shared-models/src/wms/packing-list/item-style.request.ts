import { CommonRequestAttrs } from "../../common";

export class ItemStylesRequest extends CommonRequestAttrs{
    itemStyle: string[]; 
    constructor(itemStyle: string[],
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.itemStyle = itemStyle;
    }
}