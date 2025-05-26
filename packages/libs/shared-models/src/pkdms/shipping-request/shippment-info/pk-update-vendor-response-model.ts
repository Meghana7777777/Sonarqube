export class VendorInfoByShippingReqIdModel {
    shippingReqId: number;
    vendorId: number;
    vendorName: string;
    shippingInfo: string;
    planningDispatchDate: Date;
    remarks: string;

    constructor(
        shippingReqId: number,
        vendorId: number,
        vendorName: string,
        shippingInfo: string,
        planningDispatchDate: Date,
        remarks: string
    ) {
        this.shippingReqId = shippingReqId;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.shippingInfo = shippingInfo;
        this.planningDispatchDate = planningDispatchDate;
        this.remarks = remarks;
    }
}
