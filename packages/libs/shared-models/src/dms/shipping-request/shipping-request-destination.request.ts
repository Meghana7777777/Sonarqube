import { CommonRequestAttrs } from "../../common";

export class ShippingRequestDestionationRequest extends CommonRequestAttrs {
    srId: number; // PK of the shipping_request
    destinationId: number; // PK of the vendors in master services
    expectedDispatchDate: string;
    remarks: string;
    constructor(
        srId: number,
        destinationId: number,
        expectedDispatchDate: string,
        remarks: string,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.srId = srId
        this.destinationId = destinationId
        this.expectedDispatchDate = expectedDispatchDate
        this.remarks = remarks
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}