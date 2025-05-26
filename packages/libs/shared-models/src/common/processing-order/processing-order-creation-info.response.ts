import { GlobalResponseObject } from "../global-response-object";
import { ProcessingOrderCreationInfoModel } from "./processing-order-creation-info.model";

export class ProcessingOrderCreationInfoResponse extends GlobalResponseObject {
    data?: ProcessingOrderCreationInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProcessingOrderCreationInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}