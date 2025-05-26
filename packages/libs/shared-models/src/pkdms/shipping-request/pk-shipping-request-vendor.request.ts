import { CommonRequestAttrs } from "../../common";

export class PkShippingRequestVendorRequest extends CommonRequestAttrs {

    vendorId: number
    remarks: string
    plannedDispatchDate: string
    sRequestId: number
    constructor(
        vendorId: number,
        remarks: string,
        plannedDispatchDate: string,
        sRequestId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId,)

        this.vendorId = vendorId
        this.remarks = remarks
        this.plannedDispatchDate = plannedDispatchDate
        this.sRequestId = sRequestId
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}