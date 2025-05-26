import { GlobalResponseObject } from "../../common";
import { SewingJobSummaryForSewingOrder } from "./sewing-job-gen-for-actuals.models";

export class SewingJobSummaryForSewOrderResp extends GlobalResponseObject {
    data: SewingJobSummaryForSewingOrder;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobSummaryForSewingOrder) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}