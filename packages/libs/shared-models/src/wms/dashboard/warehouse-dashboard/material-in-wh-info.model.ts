import { MaterialAllocationStatus } from "./material-allocation-status.model";
import { MaterialComparisonObj } from "./material-comparison";
import { MaterialGRNStatus } from "./material-grn-status.model";
import { MaterialInspectionStatus } from "./material-inspection-status.model";
import { MaterialIssuedInfo } from "./material-issued-info-model";

export class MaterialInWhInfoModel {
    materialName: string;
    materialStyleType:string;
    materialTotalLength: number; // Updated to number for calculations
    numberOfRolls: number;
    materialGRNStatus: MaterialGRNStatus;
    materialInspectionStatus: MaterialInspectionStatus;
    materialAllocationStatus: MaterialAllocationStatus;
    issued: MaterialIssuedInfo;

    constructor(
        materialName: string,
        materialStyleType:string,
        materialTotalLength: number,
        numberOfRolls: number,
        materialGRNStatus: MaterialGRNStatus,
        materialInspectionStatus: MaterialInspectionStatus,
        materialAllocationStatus: MaterialAllocationStatus,
        issued: MaterialIssuedInfo
    ) {
        this.materialName = materialName;
        this.materialStyleType = materialStyleType
        this.materialTotalLength = materialTotalLength;
        this.numberOfRolls = numberOfRolls;
        this.materialGRNStatus = materialGRNStatus;
        this.materialInspectionStatus = materialInspectionStatus;
        this.materialAllocationStatus = materialAllocationStatus;
        this.issued = issued;
    }
}

