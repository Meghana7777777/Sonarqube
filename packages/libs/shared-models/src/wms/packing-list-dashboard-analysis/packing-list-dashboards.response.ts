import { GlobalResponseObject } from "../../common"
import { SupplierDetails } from "./packing-list-dashboards-model";

export class PackingListDashboardsResponse extends GlobalResponseObject{

    data?:SupplierDetails[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: SupplierDetails[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}

