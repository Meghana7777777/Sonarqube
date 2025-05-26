import { GlobalResponseObject } from "../global-response-object";
import { ProcessingOrderCreationInfoModel } from "./processing-order-creation-info.model";
import { ProductInfoModel } from "./product-info-model";

export class ProductInfoResponse extends GlobalResponseObject {
    data?: ProductInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProductInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}