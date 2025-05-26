import { GlobalResponseObject } from "@xpparel/shared-models";
import { PkShippingRequestModel } from "./pk-shipping-request.model";

export class PkShippingRequestResponse extends GlobalResponseObject {
    data: PkShippingRequestModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkShippingRequestModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}