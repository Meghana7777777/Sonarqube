import { GlobalResponseObject } from "../../common";
import { ProductItemModel } from "./product-item.model";

export class ProductItemResponse extends GlobalResponseObject {
    data?: ProductItemModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProductItemModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}