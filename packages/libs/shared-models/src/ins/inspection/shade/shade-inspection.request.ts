import { InsCommonInspectionHeaderInfo } from "../common-insp-header-info";
import { InsShadeInspectionRollDetails } from "./shade-inspection-roll-details.model";

export class InsShadeInspectionRequest {
    inspectionHeader: InsCommonInspectionHeaderInfo;
    inspectionRollDetails: InsShadeInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}