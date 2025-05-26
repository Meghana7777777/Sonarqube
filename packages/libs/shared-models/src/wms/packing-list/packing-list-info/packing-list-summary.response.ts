import { GlobalResponseObject } from "../../../common";
import { PackingListSummaryModel } from "./packing-list-summary.model";

export class PackingListSummaryResponse extends GlobalResponseObject {
    data?:PackingListSummaryModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: PackingListSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
    
}

