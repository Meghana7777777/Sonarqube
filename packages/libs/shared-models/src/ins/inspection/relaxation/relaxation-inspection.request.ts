import { InsCommonInspectionHeaderInfo } from "../common-insp-header-info";
import { InsRelaxationInspectionRollDetails } from "./relaxation-inspection-roll-details.model";

export class InsRelaxationInspectionRequest {
    inspectionHeader: InsCommonInspectionHeaderInfo;
    inspectionRollDetails: InsRelaxationInspectionRollDetails[];
    unitCode: string;
    companyCode: string;
    userName: string;
}