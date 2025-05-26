import { MaterialAllocatedDocketModel } from "../../lay-reporting";

export class DocketsCardDetailsListModel {
    totalDocketsGeneratedToday : Number
    totalMaterialAllocatedDocketsToday : Number
    totalDocketsPlannedToday : Number
    constructor(
        totalDocketsGeneratedToday : Number,
        totalMaterialAllocatedDocketsToday : Number,
        totalDocketsPlannedToday : Number
    ) {
      this.totalDocketsGeneratedToday = totalDocketsGeneratedToday;
      this.totalMaterialAllocatedDocketsToday = totalMaterialAllocatedDocketsToday;
      this.totalDocketsPlannedToday = totalDocketsPlannedToday;
     
    }
  }
  
  export class DocketQuantityInformation {
    plannedAllocation : Number
    actualAllocation : Number
    pendingAllocation : Number
    plannedIssuance : Number
    plannedIssuanceRolls: Number
    actualIssuance : Number
    pendingIssuance : Number
    constructor(
      plannedAllocation : Number,
      actualAllocation : Number,
      pendingAllocation : Number,
      plannedIssuance : Number,
      plannedIssuanceRolls : Number,
      actualIssuance : Number,
      pendingIssuance : Number,
    ) {
      this.plannedAllocation = plannedAllocation;
      this.actualAllocation = actualAllocation;
      this.pendingAllocation = pendingAllocation;
      this.plannedIssuance = plannedIssuance;
      this.plannedIssuanceRolls = plannedIssuanceRolls;
      this.actualIssuance = actualIssuance;
      this.pendingIssuance = pendingIssuance;
     
    }
  }
  