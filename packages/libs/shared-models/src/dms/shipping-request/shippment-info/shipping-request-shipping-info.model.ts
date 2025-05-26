import { VendorModel } from "../../../ums";

export class ShippingRequestShippingInfoModel {
    receiverId: number; // PK of the vendors in masters service
    remarks: string;
    expectedDispatchDate: string; // The date at which the truct leaves the source
    vendorInfo: VendorModel;
    constructor(
        receiverId: number, // PK of the vendors in masters service
        remarks: string,
        expectedDispatchDate: string,
        vendorInfo: VendorModel
    ) {
        this.receiverId = receiverId;
        this.remarks = remarks;
        this.expectedDispatchDate = expectedDispatchDate;
        this.vendorInfo = vendorInfo;
    }
}