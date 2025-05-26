import { CommonRequestAttrs } from "../../common";

export class VendorIdRequest extends CommonRequestAttrs {

    vendorId: number; // the PK of the vendor entity

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        vendorId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.vendorId = vendorId;
    }

}