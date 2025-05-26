import { ArrivalPlanActualCountModel } from "./arrival-plan-actual-count.model";
export class SupplierWisePlanActualCount {
    supplierName: string;
    supplierCode: string;
    planActualCount: ArrivalPlanActualCountModel;
  
    constructor(
      supplierName: string,
      supplierCode: string,
      planActualCount: ArrivalPlanActualCountModel
    ) {
      this.supplierName = supplierName;
      this.supplierCode = supplierCode;
      this.planActualCount = planActualCount;
    }
  }