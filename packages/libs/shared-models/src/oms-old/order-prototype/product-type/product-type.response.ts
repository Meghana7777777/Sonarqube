import { GlobalResponseObject } from "../../../common";
import { ProductTypeModel } from "./product-type.model";

export class ProductTypeResponse extends GlobalResponseObject {
    data?: ProductTypeModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProductTypeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}