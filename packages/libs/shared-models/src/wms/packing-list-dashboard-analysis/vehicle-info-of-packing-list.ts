import { VehicleDetails } from "./vehicle-details";

export class CheckinAndOuts {
    numberOfCheckinsHaveToBeDone: number; // Total number of check-ins that should be done --> those ph id's are available in the packing list header table but not in ph_vehicle
    numberOfCheckinsHappened: number;   // Number of check-ins actually performed --> today's check in date values from ph vehicle
  
    numberOfCheckOutHappened: number;   // Number of check-ins actually performed --> today's check in date values from ph vehicle
  
    averageCheckIns: number;       // Average check -ins / day --> average checkins for last two months
    averageCheckOuts: number;       // Average check -ins / day --> average checkouts for last two months
  
    averageTOT: number; // Gap between in and out for all the phids and do the average
    date: Date;           // Date of the check-ins -> todays date
    vehicleInTheCompany:number; ///--> in done out not done
    vehiclesWaitingForUnloading: VehicleDetails[];   // Details of the vehicles involved in check-ins and not in unloading // 10 - 2  = 8
    vehiclesWaitingForCheckOut: VehicleDetails[];   // Details of the vehicles involved in unloading complete but check out // 1  = 

    constructor(
        numberOfCheckinsHaveToBeDone : number,
        numberOfCheckinsHappened : number,
        numberOfCheckOutHappened : number,
        averageCheckIns : number,
        averageCheckOuts : number,
        averageTOT : number,
        date : Date,
        vehicleInTheCompany : number,
        vehiclesWaitingForUnloading : VehicleDetails[] ,
        vehiclesWaitingForCheckOut : VehicleDetails[] 

    ){
        this.numberOfCheckinsHaveToBeDone = numberOfCheckinsHaveToBeDone;
        this.numberOfCheckinsHappened = numberOfCheckinsHappened;
        this.numberOfCheckOutHappened = numberOfCheckOutHappened;
        this.averageCheckIns = averageCheckIns;
        this.averageCheckOuts = averageCheckOuts=
        this.averageTOT = averageTOT;
        this.date  = date;
        this.vehicleInTheCompany = vehicleInTheCompany;
        this.vehiclesWaitingForUnloading  = vehiclesWaitingForUnloading;
        this.vehiclesWaitingForCheckOut = vehiclesWaitingForCheckOut;
    }
  }