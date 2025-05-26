import { GlobalResponseObject } from "../../common";
import { SupplierPoModel } from "./supplier-po.model";

export class SuppliersResponse extends GlobalResponseObject {
    data: SupplierPoModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: SupplierPoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}