import { GlobalResponseObject } from "../../common";
import { PoSummaryDataModel } from "./po-data-summary.model";

export class PoDataSummaryResponse extends GlobalResponseObject {
    data: PoSummaryDataModel[]
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoSummaryDataModel[]){
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}