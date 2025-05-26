import { InsInspectionRollSelectionTypeEnum, InspectionTypeEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";

export class SystematicPreferenceReqModel extends CommonRequestAttrs {
  po: number;
  insSelectionType: InspectionTypeEnum | InsInspectionRollSelectionTypeEnum;
  pickPercentage: number;
  remarks: string;
  inspectionType: string[]
  constructor(username: string,
    unitCode: string,
    companyCode: string,
    userId: number, po: number, insSelectionType: InspectionTypeEnum | InsInspectionRollSelectionTypeEnum, pickPercentage: number, remarks: string, inspectionType: string[]) {
    super(username, unitCode, companyCode, userId)
    this.po = po;
    this.insSelectionType = insSelectionType;
    this.pickPercentage = pickPercentage;
    this.remarks = remarks;
    this.inspectionType = inspectionType;
  }
}