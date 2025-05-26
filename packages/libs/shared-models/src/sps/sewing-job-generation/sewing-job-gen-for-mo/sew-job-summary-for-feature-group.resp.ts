import { GlobalResponseObject } from "../../../common";
import { SewingJobSummaryFeatureGroupForMo } from "./sew-job-gen-for-mo.models";

export class SewJobSummaryForFeatureGroupResp extends GlobalResponseObject {
    data: SewingJobSummaryFeatureGroupForMo[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobSummaryFeatureGroupForMo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}