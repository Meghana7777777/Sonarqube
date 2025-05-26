import { DocketBundleWiseCutReportInfo } from "../../cps";

export class JobWithDocBundlesResp {
    jobNumber: string;
    docBundles: DocketBundleWiseCutReportInfo[];
}