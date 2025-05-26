import { GlobalResponseObject } from "../global-response-object";
import { ProcessingOrderInfoModel } from "./processing-order-info-model";

export class ProcessingOrderInfoResponse extends GlobalResponseObject {
    data?: ProcessingOrderInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProcessingOrderInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}