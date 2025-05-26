import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { VendorModel } from "./vendor.model";

export class VendorResponse extends GlobalResponseObject {

    data ?: VendorModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: VendorModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}