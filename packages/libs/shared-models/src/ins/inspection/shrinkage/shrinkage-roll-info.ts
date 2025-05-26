import { InsCommonInspRollInfo } from "../common-insp-roll-info";
import { InsShrinkageTypeInspectionRollDetails } from "./shrinkage-type-insp-roll-details";

export class InsShrinkageRollInfo {
    rollInfo: InsCommonInspRollInfo;
    shrinkageTypes: InsShrinkageTypeInspectionRollDetails[];

    /**
     * 
     * @param rollInfo 
     * @param shrinkageTypes 
    */
    constructor(rollInfo: InsCommonInspRollInfo, shrinkageTypes: InsShrinkageTypeInspectionRollDetails[]) {
        this.rollInfo = rollInfo;
        this.shrinkageTypes = shrinkageTypes;
    }
}   