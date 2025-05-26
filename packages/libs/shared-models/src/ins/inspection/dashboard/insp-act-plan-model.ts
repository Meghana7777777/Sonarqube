import { InsFabricInspectionRequestCategoryEnum } from "../../enum";

export class InsInspActPlanModel {
    rangedDate: Date; // MONTH + YEAR / DATE / YEAR
    actualCount: number; // ins_completed_at
    expectedCount: number; // material_receive_at
    processType: InsFabricInspectionRequestCategoryEnum; // request_category
}