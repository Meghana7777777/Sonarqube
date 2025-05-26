import { GlobalResponseObject } from "../../common";
import { DocketBundleWiseCutReportInfo } from "../../cps";
import { CutInfo, FeatureGroupDetails } from "./sewing-job-gen-for-actuals.models";

export class FeatureGroupCutDetailsResp extends GlobalResponseObject {
    data: DocketBundleWiseCutReportInfo[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketBundleWiseCutReportInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}