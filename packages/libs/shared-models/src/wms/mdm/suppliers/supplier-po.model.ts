import { CommonRequestAttrs } from "../../../common";
import { SuppliersModel } from "./suppliers.model";


export class SupplierPoModel extends CommonRequestAttrs {
    id: number;
    poDesc: string;
    poDate: string;
    vpo: string;
    supplierId: string;
    supplierCode: string;
    supplierName: string;
}

