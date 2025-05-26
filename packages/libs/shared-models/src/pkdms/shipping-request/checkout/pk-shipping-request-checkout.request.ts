import { CommonRequestAttrs } from "../../../common";
import { PkShippingRequestTruckCheckoutModel } from "./pk-shipping-request-truck-checkout.model";

export class PkShippingRequestCheckoutRequest extends CommonRequestAttrs {
    srId: number; // PK of the shipping_request
    checkoutDate: string;
    truckOutTimes: PkShippingRequestTruckCheckoutModel[];
    remarks: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        srId: number, // PK of the shipping_request
        checkoutDate: string,
        truckOutTimes: PkShippingRequestTruckCheckoutModel[],
        remarks: string
    ) {
        super(username, unitCode, companyCode, userId)
        this.srId = srId;
        this.checkoutDate = checkoutDate;
        this.truckOutTimes = truckOutTimes;
        this.remarks = remarks
    }
}

