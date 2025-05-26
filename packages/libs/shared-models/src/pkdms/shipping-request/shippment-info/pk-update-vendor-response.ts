import { GlobalResponseObject } from "../../../common";
import { VendorInfoByShippingReqIdModel } from "./pk-update-vendor-response-model";

export class UpdateVendorResponseModel extends GlobalResponseObject{
    data: VendorInfoByShippingReqIdModel;
    constructor(status: boolean, errorCode: number, internalMessage: string, data: VendorInfoByShippingReqIdModel) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}