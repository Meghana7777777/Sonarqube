export class BinRollDetails {
    binID: string;  // Unique identifier for the bin
    binEnteredDate: string;   // Date the bin was entered into the warehouse
    rollsInBin: number;    // Number of rolls currently in the bin
    balesInBin: number;
    binOccupancy: string;   // Occupancy status of the bin expects percentage%
    binRackID: string;   // ID of the rack where the bin is located
    binLocation: string;   // Location of the bin within the rack in the warehouse
    materialInBin: string[];  // Type of material stored in the bin
    materialInspectionStatus: string;   // Inspection status of the material in the bin (e.g., inspected, pending, inprogress)
    totalFabricMeterageStock: number;   // Total meterage of fabric stock in the bin
    allocatedStockMeterage: number;   // Meterage of stock that has been allocated for Inspection
    nonAllocatedStockMeterage: number;   // Meterage of stock that is not allocated for Inspection
    materialAgeAfterInspection: string;    // Age of the material after inspection 
    materialAllocatedForProduction: boolean;     // Status of the material if it was entered into production or not (Allocated or Not Allocated)
    materialProductionAllocatedDate: string; // Date of Material Allocation for Production
    relaxedFabricMeterageStock: number;   // Meterage of relaxed fabric stock in the bin
    relaxedFabricPercentage: string;    // Percentage of relaxed fabric in relation to total stock
    emptyPalletsInBin: number;
  
    constructor(
      binID: string,
      binEnteredDate: string,
      rollsInBin: number,
      balesInBin: number,
      binOccupancy: string,
      binRackID: string,
      binLocation: string,
      materialInBin: string[],
      materialInspectionStatus: string,
      totalFabricMeterageStock: number,
      allocatedStockMeterage: number,
      nonAllocatedStockMeterage: number,
      materialAgeAfterInspection: string,
      materialAllocatedForProduction: boolean,
      materialProductionAllocatedDate: string,
      relaxedFabricMeterageStock: number,
      relaxedFabricPercentage: string,
      emptyPalletsInBin: number
    ) {
      this.binID = binID;
      this.binEnteredDate = binEnteredDate;
      this.rollsInBin = rollsInBin;
      this.balesInBin = balesInBin;
      this.binOccupancy = binOccupancy;
      this.binRackID = binRackID;
      this.binLocation = binLocation;
      this.materialInBin = materialInBin;
      this.materialInspectionStatus = materialInspectionStatus;
      this.totalFabricMeterageStock = totalFabricMeterageStock;
      this.allocatedStockMeterage = allocatedStockMeterage;
      this.nonAllocatedStockMeterage = nonAllocatedStockMeterage;
      this.materialAgeAfterInspection = materialAgeAfterInspection;
      this.materialAllocatedForProduction = materialAllocatedForProduction;
      this.materialProductionAllocatedDate = materialProductionAllocatedDate;
      this.relaxedFabricMeterageStock = relaxedFabricMeterageStock;
      this.relaxedFabricPercentage = relaxedFabricPercentage;
      this.emptyPalletsInBin = emptyPalletsInBin;
    }
  }
  