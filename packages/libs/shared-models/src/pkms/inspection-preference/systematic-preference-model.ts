import { InspectionTypeEnum } from "@xpparel/shared-models";


export class SystematicPreferenceModel {
    po: number;
    insSelectionType: InspectionTypeEnum;
    pickPercentage: number;
    remarks: string;
    inspectionType: string[];
    constructor(po: number, insSelectionType: InspectionTypeEnum, pickPercentage: number, remarks: string, inspectionType: string[]) {
        this.po = po;
        this.insSelectionType = insSelectionType;
        this.pickPercentage = pickPercentage;
        this.remarks = remarks;
        this.inspectionType = inspectionType;
    }


}