import { CommonRequestAttrs } from "../../common";


export class SupplierPoModel extends CommonRequestAttrs {
    id: number;
    poDesc: string;
    poDate: string;
    vpo: string;
    supplierId: string;
    supplierCode: string;
    supplierName: string;
    constructor(id: number,
        poDesc: string,
        poDate: string,
        vpo: string,
        supplierId: string,
        supplierCode: string,
        supplierName: string, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.poDesc = poDesc;
        this.poDate = poDate;
        this.vpo = vpo;
        this.supplierId = supplierId;
        this.supplierCode = supplierCode;
        this.supplierName = supplierName;
    }
}

