export class UnloadingVehicleDetails {
  vehicleNumber: string;
  driverName: string;
  driverPhnNumber: string;

  unloadingStartTime: Date;
  unloadingEndTime: Date;
  unloadingPauseTime: Date;
  unloadingSpentSecs: number;


  unloadingStatus: string;

  supplierName: string;
  packingListNumber: string;

  weight: number;

  scheduleArrivalDateTime: Date;
  actualArrivalTime: Date;
  gotTheGateAt: Date;

  totalRolls: number;
  unloadedRolls: number;
  unloadedWeight: number;

  unloadedRollsPerHour: number;
  unloadedWeightPerHour: number;
  
  vehicleDepartedAt: Date;
  tatOfVehicle: number;
  materialItemCode: string;

  constructor(
    vehicleNumber: string,
    driverName: string,
    driverPhnNumber: string,
    unloadingStartTime: Date,
    unloadingEndTime: Date,
    unloadingPauseTime: Date,
    unloadingSpentSecs: number,
    unloadingStatus: string,
    supplierName: string,
    packingListNumber: string,
    weight: number,
    scheduleArrivalDateTime: Date,
    actualArrivalTime: Date,
    gotTheGateAt: Date,
    totalRolls: number,
    unloadedRolls: number,
    unloadedWeight: number,
    unloadedRollsPerHour: number,
    unloadedWeightPerHour: number,
    vehicleDepartedAt: Date,
    tatOfVehicle: number,
    materialItemCode: string
  ) {
    this.vehicleNumber = vehicleNumber;
    this.driverName = driverName;
    this.driverPhnNumber = driverPhnNumber;
    this.unloadingStartTime = unloadingStartTime;
    this.unloadingEndTime = unloadingEndTime;
    this.unloadingPauseTime = unloadingPauseTime;
    this.unloadingSpentSecs = unloadingSpentSecs;
    this.unloadingStatus = unloadingStatus;
    this.supplierName = supplierName;
    this.packingListNumber = packingListNumber;
    this.weight = weight;
    this.scheduleArrivalDateTime = scheduleArrivalDateTime;
    this.actualArrivalTime = actualArrivalTime;
    this.gotTheGateAt = gotTheGateAt;
    this.totalRolls = totalRolls;
    this.unloadedRolls = unloadedRolls;
    this.unloadedWeight = unloadedWeight;
    this.unloadedRollsPerHour = unloadedRollsPerHour;
    this.unloadedWeightPerHour = unloadedWeightPerHour;
    this.vehicleDepartedAt = vehicleDepartedAt;
    this.tatOfVehicle = tatOfVehicle;
    this.materialItemCode = materialItemCode;
  }
}
