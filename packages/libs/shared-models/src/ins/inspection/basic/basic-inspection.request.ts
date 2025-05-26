import { InsCommonInspectionHeaderInfo, ThreadInsCommonInspectionHeaderInfo, TrimInsCommonInspectionHeaderInfo, YarnInsCommonInspectionHeaderInfo } from "../common-insp-header-info";
import { InsBasicInspectionRollDetails, ThreadInsBasicInspectionRollDetails, TrimInsBasicInspectionRollDetails, YarnInsBasicInspectionRollDetails } from "./basic-inspection-roll-details.model";



export class InsBasicInspectionRequest {
    inspectionHeader: InsCommonInspectionHeaderInfo;
    inspectionRollDetails: InsBasicInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}


export class YarnInsBasicInspectionRequest {
    inspectionHeader: YarnInsCommonInspectionHeaderInfo;
    inspectionRollDetails: YarnInsBasicInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}

export class ThreadInsBasicInspectionRequest {
    inspectionHeader: ThreadInsCommonInspectionHeaderInfo;
    inspectionRollDetails: ThreadInsBasicInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}

export class TrimInsBasicInspectionRequest {
    inspectionHeader: TrimInsCommonInspectionHeaderInfo;
    inspectionRollDetails: TrimInsBasicInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}