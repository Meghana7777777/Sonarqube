import { GlobalResponseObject } from "../../../common";
import { PkShippingDispatchRequestModel } from "./pk-shipping-dispatch-request-model";

export class PkShippingDispatchResponse extends GlobalResponseObject {
    data : PkShippingDispatchRequestModel;

    constructor( status : boolean , errorCode : number, internalMessage : string , data : PkShippingDispatchRequestModel) {
        super(status,errorCode,internalMessage);
        this.data = data;
    }

}