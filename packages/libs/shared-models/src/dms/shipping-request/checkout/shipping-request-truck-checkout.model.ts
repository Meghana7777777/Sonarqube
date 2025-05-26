import { CommonRequestAttrs } from "../../../common";

export class ShippingRequestTruckCheckoutModel {
    truckId: number;
    checkoutDateTime: string; // datetime
    remarks: string;
    constructor(
        truckId: number,
        checkoutDateTime: string, // datetime
        remarks: string
    ) {
        this.truckId = truckId;
        this.checkoutDateTime = checkoutDateTime;
        this.remarks = remarks;
    }
}