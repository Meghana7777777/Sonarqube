export class LocationCartonDetails {
    locationID: string;  // Unique identifier for the location
    locationEnteredDate: string;   // Date the location was entered into the warehouse
    cartonsInLocation: number;    // Number of cartons currently in the location
    balesInLocation: number;
    locationOccupancy: string;   // Occupancy status of the location expects percentage%
    locationRackID: string;   // ID of the rack where the location is located
    locationLocation: string;   // Location of the location within the rack in the warehouse
    materialInLocation: string[];  // Type of material stored in the location
    materialInspectionStatus: string;   // Inspection status of the material in the location (e.g., inspected, pending, inprogress)
    totalFabricMeterageStock: number;   // Total meterage of fabric stock in the location
    allocatedStockMeterage: number;   // Meterage of stock that has been allocated for Inspection
    nonAllocatedStockMeterage: number;   // Meterage of stock that is not allocated for Inspection
    materialAgeAfterInspection: string;    // Age of the material after inspection 
    materialAllocatedForProduction: boolean;     // Status of the material if it was entered into production or not (Allocated or Not Allocated)
    materialProductionAllocatedDate: string; // Date of Material Allocation for Production
    relaxedFabricMeterageStock: number;   // Meterage of relaxed fabric stock in the location
    relaxedFabricPercentage: string;    // Percentage of relaxed fabric in relation to total stock
    emptyPalletsInLocation: number;
  
    constructor(
      locationID: string,
      locationEnteredDate: string,
      cartonsInLocation: number,
      balesInLocation: number,
      locationOccupancy: string,
      locationRackID: string,
      locationLocation: string,
      materialInLocation: string[],
      materialInspectionStatus: string,
      totalFabricMeterageStock: number,
      allocatedStockMeterage: number,
      nonAllocatedStockMeterage: number,
      materialAgeAfterInspection: string,
      materialAllocatedForProduction: boolean,
      materialProductionAllocatedDate: string,
      relaxedFabricMeterageStock: number,
      relaxedFabricPercentage: string,
      emptyPalletsInLocation: number
    ) {
      this.locationID = locationID;
      this.locationEnteredDate = locationEnteredDate;
      this.cartonsInLocation = cartonsInLocation;
      this.balesInLocation = balesInLocation;
      this.locationOccupancy = locationOccupancy;
      this.locationRackID = locationRackID;
      this.locationLocation = locationLocation;
      this.materialInLocation = materialInLocation;
      this.materialInspectionStatus = materialInspectionStatus;
      this.totalFabricMeterageStock = totalFabricMeterageStock;
      this.allocatedStockMeterage = allocatedStockMeterage;
      this.nonAllocatedStockMeterage = nonAllocatedStockMeterage;
      this.materialAgeAfterInspection = materialAgeAfterInspection;
      this.materialAllocatedForProduction = materialAllocatedForProduction;
      this.materialProductionAllocatedDate = materialProductionAllocatedDate;
      this.relaxedFabricMeterageStock = relaxedFabricMeterageStock;
      this.relaxedFabricPercentage = relaxedFabricPercentage;
      this.emptyPalletsInLocation = emptyPalletsInLocation;
    }
  }
  