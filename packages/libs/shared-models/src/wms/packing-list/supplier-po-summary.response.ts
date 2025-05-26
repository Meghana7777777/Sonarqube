import { GlobalResponseObject } from "../../common";
import { SupplierPoSummaryModel } from "./supplier-po-summary.model";

export class SupplierPoSummaryResponse extends GlobalResponseObject{
    data : SupplierPoSummaryModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: SupplierPoSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}