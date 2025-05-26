import { GlobalResponseObject } from "../../common";
import { MoDataForSoSummaryModel } from "./mo-data-for-so-summary.model";

export class MoDataForSoSummaryResponse extends GlobalResponseObject {
    data: MoDataForSoSummaryModel[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoDataForSoSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}