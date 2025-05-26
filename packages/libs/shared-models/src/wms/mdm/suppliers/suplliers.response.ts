import { GlobalResponseObject } from "../../../common";
import { SuppliersModel } from "./suppliers.model";


export class SuppliersResponse extends GlobalResponseObject {
    data: SuppliersModel[];
}