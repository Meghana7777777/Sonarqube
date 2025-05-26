import { GlobalResponseObject } from "../../../common";
import { ProductsModel } from "./product-model";

export class ProductsResponse extends GlobalResponseObject {
    data?: ProductsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ProductsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}