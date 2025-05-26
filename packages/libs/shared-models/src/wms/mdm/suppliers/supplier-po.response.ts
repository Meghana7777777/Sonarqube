import { GlobalResponseObject } from "../../../common";
import { SupplierPoModel } from "./supplier-po.model";


export class SuppliersResponse extends GlobalResponseObject {
    data: SupplierPoModel[];
}