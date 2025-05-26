import { GlobalResponseObject } from "../global-response-object";
import { PO_StyleInfoModel } from "./po-style-info-model";
import { ProcessingOrderCreationInfoModel } from "./processing-order-creation-info.model";
import { ProductInfoModel } from "./product-info-model";

export class PO_StyleInfoResponse extends GlobalResponseObject {
    data?: PO_StyleInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PO_StyleInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}