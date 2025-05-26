import { CommonRequestAttrs } from "../../common";

export class SupplierCodeReq extends CommonRequestAttrs {

    // TODO
    // id: number;
    supplierCode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, supplierCode: string) {
        super(username, unitCode, companyCode, userId)
        this.supplierCode = supplierCode;
    }
}
