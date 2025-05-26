import { InsCommonInspectionHeaderInfo } from "../common-insp-header-info";
import { InsShrinkageRollInfo } from "./shrinkage-roll-info";
export class InsShrinkageInspectionRequest {
    inspectionHeader: InsCommonInspectionHeaderInfo;
    inspectionRollDetails: InsShrinkageRollInfo[];
    unitCode: string;
    companyCode: string;
    userName: string;
}