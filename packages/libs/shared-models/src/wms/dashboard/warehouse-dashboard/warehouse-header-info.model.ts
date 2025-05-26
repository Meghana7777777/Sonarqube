import { BinAvailability } from "./bin-availability.model";

export class WarehouseHeaderInfoModel {
  warehouseCapacity: number; // Total bins in the warehouse
  binsAvailability: BinAvailability;
  totalEmptyBins: number;
  todayTotalAllocationIMts: number;
  todayTotalIssuanceInMts: number;

  todayPendingIssuanceInMts: number;
  todayPendingIssuanceInNoOfRolls: number;

  noOfPackingListsToWhCheckIn: number;
  noOfPackingListsToWhCheckInToday: number;

  rackIDS: number[];


  warehouseCapacityInMts: number;
  totalFabricMeterage: number;
  totalRelaxedFabricMeterage: number;
  totalRelaxedFabricMeterageToday: number;

  plannedAllocation: number;
  todayAllocation: number;
  balanceAllocation: number;
  plannedIssuance: number;
  plannedIssuanceRolls: number;
  todayIssuance: number;
  todayIssuanceRolls: number;
  balanceIssuance: number;
  balanceIssuanceRolls: number;
  totalRolls: number;
  totalBalesInWh: number;

  constructor(
    warehouseCapacity: number,
    binsAvailability: BinAvailability,
    totalEmptyBins: number,

    todayTotalAllocationIMts: number,
    todayTotalIssuanceInMts: number,
    todayPendingIssuanceInMts: number,
    todayPendingIssuanceInNoOfRolls: number,
    noOfPackingListsToWhCheckIn: number,
    noOfPackingListsToWhCheckInToday: number,
    rackIDS: number[],

    warehouseCapacityInMts: number,
    totalFabricMeterage: number,
    totalRelaxedFabricMeterage: number,
    totalRelaxedFabricMeterageToday: number,

    plannedAllocation: number,
    todayAllocation: number,
    balanceAllocation: number,
    plannedIssuance: number,
    plannedIssuanceRolls: number,
    todayIssuance: number,
    todayIssuanceRolls: number,
    balanceIssuance: number,
    balanceIssuanceRolls: number,
    totalRolls: number,
    totalBalesInWh: number,
  ) {
    this.warehouseCapacity = warehouseCapacity;
    this.binsAvailability = binsAvailability;
    this.totalEmptyBins = totalEmptyBins;
    this.todayTotalAllocationIMts = todayTotalAllocationIMts;
    this.todayTotalIssuanceInMts = todayTotalIssuanceInMts;
    this.todayPendingIssuanceInMts = todayPendingIssuanceInMts;
    this.todayPendingIssuanceInNoOfRolls = todayPendingIssuanceInNoOfRolls;
    this.noOfPackingListsToWhCheckIn = noOfPackingListsToWhCheckIn;
    this.noOfPackingListsToWhCheckInToday = noOfPackingListsToWhCheckInToday;
    this.rackIDS = rackIDS;
    this.warehouseCapacityInMts = warehouseCapacityInMts;
    this.totalFabricMeterage = totalFabricMeterage;
    this.totalRelaxedFabricMeterage = totalRelaxedFabricMeterage;
    this.totalRelaxedFabricMeterageToday = totalRelaxedFabricMeterageToday;
    this.plannedAllocation = plannedAllocation;
    this.todayAllocation = todayAllocation;
    this.balanceAllocation = balanceAllocation;
    this.plannedIssuance = plannedIssuance;
    this.plannedIssuanceRolls = plannedIssuanceRolls;
    this.todayIssuance = todayIssuance;
    this.todayIssuanceRolls = todayIssuanceRolls;
    this.balanceIssuance = balanceIssuance;
    this.balanceIssuanceRolls = balanceIssuanceRolls;
    this.totalRolls = totalRolls;
    this.totalBalesInWh = totalBalesInWh;
  }
}
