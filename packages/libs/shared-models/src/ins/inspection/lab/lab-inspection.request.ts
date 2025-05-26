import { InsCommonInspectionHeaderInfo } from "../common-insp-header-info";
import { InsLabInspectionRollDetails } from "./lab-inspection-roll-details.model";

export class InsLabInspectionRequest {
    inspectionHeader: InsCommonInspectionHeaderInfo;
    inspectionRollDetails: InsLabInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}