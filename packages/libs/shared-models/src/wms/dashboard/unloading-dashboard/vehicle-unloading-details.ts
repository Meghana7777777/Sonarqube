import { CommonRequestAttrs } from "../../../common";
import { UnloadingVehicleDetails } from "./unloading-vehicle-details.model";

export class UnloadingVehicleDetailsModel {
  vehicleArrivedButNotStartedInfo: UnloadingVehicleDetails[];
  vehicleUnloadSInProgressInfo: UnloadingVehicleDetails[];
  vehicleUnloadCompletedButNotDepartedInfo: UnloadingVehicleDetails[];
  todayVehicleDepartedInfo: UnloadingVehicleDetails[];
  todayVehicleArrivedInfo: UnloadingVehicleDetails[];
  todayVehicleUnloadedInfo: UnloadingVehicleDetails[];
  last5VehicleArrivals: UnloadingVehicleDetails[];
  last5VehicleDeparts: UnloadingVehicleDetails[];

  avgUnloadsPerDay: number;

  constructor(
    vehicleArrivedButNotStartedInfo: UnloadingVehicleDetails[],
    vehicleUnloadSInProgressInfo: UnloadingVehicleDetails[],
    vehicleUnloadCompletedButNotDepartedInfo: UnloadingVehicleDetails[],
    todayVehicleDepartedInfo: UnloadingVehicleDetails[],
    todayVehicleArrivedInfo: UnloadingVehicleDetails[],
    todayVehicleUnloadedInfo: UnloadingVehicleDetails[],
    last5VehicleArrivals: UnloadingVehicleDetails[],
    last5VehicleDeparts: UnloadingVehicleDetails[],
    avgUnloadsPerDay: number
  ) {
    this.vehicleArrivedButNotStartedInfo = vehicleArrivedButNotStartedInfo;
    this.vehicleUnloadSInProgressInfo = vehicleUnloadSInProgressInfo;
    this.vehicleUnloadCompletedButNotDepartedInfo = vehicleUnloadCompletedButNotDepartedInfo;
    this.todayVehicleDepartedInfo = todayVehicleDepartedInfo;
    this.todayVehicleArrivedInfo = todayVehicleArrivedInfo;
    this.todayVehicleUnloadedInfo = todayVehicleUnloadedInfo;
    this.last5VehicleArrivals = last5VehicleArrivals;
    this.last5VehicleDeparts = last5VehicleDeparts;
    this.avgUnloadsPerDay = avgUnloadsPerDay;
  }
}