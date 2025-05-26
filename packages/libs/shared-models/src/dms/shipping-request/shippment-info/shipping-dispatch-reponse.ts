import { GlobalResponseObject } from "../../../common";
import { ShippingDispatchRequestModel } from "./shipping-dispatch-request-model";

export class ShippingDispatchResponse extends GlobalResponseObject {
    data : ShippingDispatchRequestModel;

    constructor( status : boolean , errorCode : number, internalMessage : string , data : ShippingDispatchRequestModel) {
        super(status,errorCode,internalMessage);
        this.data = data;
    }

}