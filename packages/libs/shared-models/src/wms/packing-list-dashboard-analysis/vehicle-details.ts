export class VehicleDetails {
    vehicleNumber: string;     // Vehicles unique number
    noOfItems: number; // Supplier associated with the vehicle
    noOfEntities: number;
    guardDetails: string;     // Information about the security guard
    arrivalTime?: Date;      // Optional: Arrival time of the vehicle
    packingListId: number;

    constructor(
        vehicleNumber: string,
        noOfItems: number,
        noOfEntities: number,
        guardDetails: string,
        packingListId: number,
        arrivalTime?:Date


    ){
        this.vehicleNumber = vehicleNumber;     // Vehicles unique number
        this.noOfItems = noOfItems; // Supplier associated with the vehicle
        this.noOfEntities = noOfEntities;
        this.guardDetails =  guardDetails;     // Information about the security guard
        this.arrivalTime = arrivalTime;      // Optional: Arrival time of the vehicle
        this.packingListId = packingListId;
    }
  }