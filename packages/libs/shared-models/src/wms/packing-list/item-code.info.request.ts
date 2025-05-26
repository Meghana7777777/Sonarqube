import { CommonRequestAttrs } from "../../common";

export class ItemCodeInfoRequest extends CommonRequestAttrs {
    spoCode: string;
    itemCode:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, spoCode: string,itemCode:string) {
        super(username, unitCode, companyCode, userId)
        this.spoCode = spoCode;
        this.itemCode = itemCode;
    }
}