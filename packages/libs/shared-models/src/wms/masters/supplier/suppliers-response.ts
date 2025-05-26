import { GlobalResponseObject } from "../../../common";
import { SupplierCreationModel } from "./supplier-model";



export class SuppliersResponseK extends GlobalResponseObject {
    data?: SupplierCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: SupplierCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}