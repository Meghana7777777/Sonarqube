import { CommonRequestAttrs } from "../../../common";
import { ShippingRequestTruckCheckoutModel } from "./shipping-request-truck-checkout.model";

export class ShippingRequestCheckoutRequest extends CommonRequestAttrs {
    srId: number; // PK of the shipping_request
    checkoutDate: string;
    truckOutTimes: ShippingRequestTruckCheckoutModel[];
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        srId: number, // PK of the shipping_request
        checkoutDate: string,
        truckOutTimes: ShippingRequestTruckCheckoutModel[],
        remarks: string
    ) {
        super(username, unitCode, companyCode, userId)
        this.srId = srId;
        this.checkoutDate = checkoutDate;
        this.truckOutTimes = truckOutTimes;
        this.remarks = remarks
    }
}

