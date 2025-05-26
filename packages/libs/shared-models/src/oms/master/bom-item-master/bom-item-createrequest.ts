import { CommonRequestAttrs } from "../../../common";
import { ItemModel } from "./bom-item-model";

export class ItemCreateRequest extends CommonRequestAttrs {
    item: ItemModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        item: ItemModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.item = item;
    }
}