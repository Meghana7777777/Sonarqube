import { PackingListActualVsPlanned } from "./actual-vs-planned-details.model";
import { RollAnalysis } from "./roll-analysis-model";

export class PackageLists {
    supplierName: string; // FROM TOP
    packageId: number; // FROM TOP
    itemCode: string; // ph_items -> item_code
    poNumber: string; // null
    typeOfpackage: string; // ph_items -> item_category
    status: string; // ph -> ph_vehicle -> ph_item_lines
    priorityPercentage: string; // null
    occupancyNeed: number; // NEED TO GET THE AVG TROLLIES NEEDED FOR THE ROLL
    actualStartDate: Date; // ph_vehile -> SECURITY CHECK IN DATE
    scheduledStartDate: string; // ph.`delivery_date`
    actualEndDate: string; //  getPackListSummery -> ISSUED Date
    scheduledEndDate: string; // NULL
    arrivedDate: Date; // ph_vehile -> SECURITY CHECK IN DATE
    // aging:number;
    rollAnalysis: RollAnalysis; // ph_item_lines
    actualVsPlannedDetail: PackingListActualVsPlanned[];

    constructor(
        supplierName: string,
        packageId:number,
        itemCode: string,
        poNumber: string,
        typeOfpackage: string,
        status: string,
        priorityPercentage: string,
        occupancyNeed: number,
        actualStartDate: Date,
        scheduledStartDate: string,
        actualEndDate: string,
        scheduledEndDate: string,
        arrivedDate: Date,
        // aging:number;
        rollAnalysis: RollAnalysis,
        actualVsPlannedDetail: PackingListActualVsPlanned[]
    ){
        this.supplierName= supplierName;
        this.packageId= packageId;
        this.itemCode= itemCode;
        this.poNumber= poNumber;
        this.typeOfpackage= typeOfpackage;
        this.status= status;
        this.priorityPercentage= priorityPercentage;
        this.occupancyNeed= occupancyNeed;
        this.actualStartDate= actualStartDate;
        this.scheduledStartDate= scheduledStartDate;
        this.actualEndDate= actualEndDate;
        this.scheduledEndDate= scheduledEndDate;
        this.arrivedDate= arrivedDate;
        // aging:number;
        this.rollAnalysis= rollAnalysis;
        this.actualVsPlannedDetail= actualVsPlannedDetail;  
     }
}

