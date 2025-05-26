import { InsInspectionRollSelectionTypeEnum, InspectionTypeEnum } from "@xpparel/shared-models"

export class PreferenceSummaryRes {
    po: number
    pick_percentage: number
    ins_selection_type: InsInspectionRollSelectionTypeEnum
    remarks: string
    inspections: string
    constructor(
        po: number,
        pick_percentage: number,
        ins_selection_type: InsInspectionRollSelectionTypeEnum,
        remarks: string,
        inspections: string
    ) {
        this.po = po
        this.pick_percentage = pick_percentage
        this.ins_selection_type = ins_selection_type
        this.remarks = remarks
        this.inspections = inspections;
    }
}