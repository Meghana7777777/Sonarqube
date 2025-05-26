import { GlobalResponseObject } from "@xpparel/shared-models";
import { ShippingRequestModel } from "./shipping-request.model";

export class ShippingRequestResponse extends GlobalResponseObject {
    data: ShippingRequestModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ShippingRequestModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}