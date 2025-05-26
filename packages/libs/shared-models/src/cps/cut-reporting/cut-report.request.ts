import { CommonRequestAttrs } from "../../common";
import { CutRepAttr } from "../enum";


export class CutReportRequest extends CommonRequestAttrs {
    layId: number;
    cutRepAttrs: {[k in CutRepAttr]: string};
    manualRetry: boolean; // this variable is used when we manually trigger the cut reporting for any left over bundles if any. Used while calling manually
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        manualRetry?: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
    }
}
