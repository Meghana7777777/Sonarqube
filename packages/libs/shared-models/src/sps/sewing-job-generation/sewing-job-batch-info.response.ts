import { GlobalResponseObject } from "../../common";
import { SewingJobBatchDetails } from "./sewing-job-batch-info.model";

export class SewingJobBatchInfoResp extends GlobalResponseObject {
    data: SewingJobBatchDetails[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobBatchDetails[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}