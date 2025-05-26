import { CommonRequestAttrs } from "../../../common";
import { ArrivalPlanActualCountModel } from "./arrival-plan-actual-count.model";
import { SupWisePLArrivalDetail } from "./sup-wise-pl-arrival-details";
import { SupplierWisePlanActualCount } from "./supplier-wise-plant-actual-count.model";

export class TodayArrivalsSummaryModel {
  supplierWiseArrivals: SupWisePLArrivalDetail[];
  arrivalPlanAndActCount: SupplierWisePlanActualCount[];
  avgArrivalsPerDay: number;
  avgUnloadingPerDay: number;
  avgDepartsPerDay: number;
  avgWaitingTimeToGotTheGate: number;

  constructor(
    supplierWiseArrivals: SupWisePLArrivalDetail[],
    arrivalPlanAndActCount: SupplierWisePlanActualCount[],
    avgArrivalsPerDay: number,
    avgUnloadingPerDay: number,
    avgDepartsPerDay: number,
    avgWaitingTimeToGotTheGate: number
  ) {
    this.supplierWiseArrivals = supplierWiseArrivals;
    this.arrivalPlanAndActCount = arrivalPlanAndActCount;
    this.avgArrivalsPerDay = avgArrivalsPerDay;
    this.avgUnloadingPerDay = avgUnloadingPerDay;
    this.avgDepartsPerDay = avgDepartsPerDay;
    this.avgWaitingTimeToGotTheGate = avgWaitingTimeToGotTheGate;
  }
}