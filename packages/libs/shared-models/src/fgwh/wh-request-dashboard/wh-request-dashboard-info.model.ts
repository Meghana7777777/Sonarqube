import { CommonRequestAttrs } from "../../common";

// to get status wise requests count
export class StatusWiseRequestsCount {
    totalRequests: number; // Total number of requests
    noOfRequestsForApproval: number; // Number of requests waiting for approval
    noOfRequestsForFgIn: number; // Number of requests for FG (Finished Goods) in
    noOfRequestsForFgOut: number; // Number of requests for FG out
    noOfRequestsForLocationIn: number; // Number of requests for location in
    noOfRequestsForLocationOut: number; // Number of requests for location out

    constructor(
        totalRequests: number,
        noOfRequestsForApproval: number,
        noOfRequestsForFgIn: number,
        noOfRequestsForFgOut: number,
        noOfRequestsForLocationIn: number,
        noOfRequestsForLocationOut: number
    ) {
        this.totalRequests = totalRequests;
        this.noOfRequestsForApproval = noOfRequestsForApproval;
        this.noOfRequestsForFgIn = noOfRequestsForFgIn;
        this.noOfRequestsForFgOut = noOfRequestsForFgOut;
        this.noOfRequestsForLocationIn = noOfRequestsForLocationIn;
        this.noOfRequestsForLocationOut = noOfRequestsForLocationOut;
    }
}

export class ProgressWiseRequestsCount {
    toDoList: StatusWiseRequestsCount; // Requests in the "To Do" list
    inprogressList: StatusWiseRequestsCount; // Requests in progress
    completedList: StatusWiseRequestsCount; // Completed requests

    constructor(
        toDoList: StatusWiseRequestsCount,
        inprogressList: StatusWiseRequestsCount,
        completedList: StatusWiseRequestsCount
    ) {
        this.toDoList = toDoList;
        this.inprogressList = inprogressList;
        this.completedList = completedList;
    }
}



// to get warehouse arrivals info
export class WhFloorRequest extends CommonRequestAttrs {
    whCode: string; // Warehouse code
    floor: string; // Floor in the warehouse

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        whCode: string,
        floor: string
    ) {
        super(username, unitCode, companyCode, userId); // Calls the constructor of the parent class CommonRequestAttrs
        this.whCode = whCode;
        this.floor = floor;
    }
}


export class FGWhRequestsInfoAbstract {
    whCode: string; // Warehouse code
    floor: string; // Floor in the warehouse
    requestNo: string; // Request number
    plannedDateTime: string; // Planned date and time for the request
    packListCount: number; // Number of packing lists
    cartonCount: number; // Total number of cartons
    buyer: string; // Buyer associated with the request
    destination: string; // Destination of the goods
    deliveryDate: string; // Delivery date for the request

    constructor(
        whCode: string,
        floor: string,
        requestNo: string,
        plannedDateTime: string,
        PackListCount: number,
        cartonCount: number,
        buyer: string,
        destination: string,
        deliveryDate: string
    ) {
        this.whCode = whCode;
        this.floor = floor;
        this.requestNo = requestNo;
        this.plannedDateTime = plannedDateTime;
        this.packListCount = PackListCount;
        this.cartonCount = cartonCount;
        this.buyer = buyer;
        this.destination = destination;
        this.deliveryDate = deliveryDate;
    }
}

export class WhRequestsArrivalInfoAbstractForWhAndFloor {
    whFloorInfo: WhFloorRequest; // Information related to warehouse floor
    arrivalsInfo: FGWhRequestsInfoAbstract[]; // Array of arrivals information for the given warehouse and floor

    constructor(whFloorInfo: WhFloorRequest, arrivalsInfo: FGWhRequestsInfoAbstract[]) {
        this.whFloorInfo = whFloorInfo;
        this.arrivalsInfo = arrivalsInfo;
    }
}

// to get warehouse departure info

export class WhRequestsDepartureInfoAbstractForWhAndFloor {
    whFloorInfo: WhFloorRequest; // Information related to warehouse floor
    arrivalsInfo: FGWhRequestsInfoAbstract[]; // Array of departure information for the given warehouse and floor

    constructor(whFloorInfo: WhFloorRequest, arrivalsInfo: FGWhRequestsInfoAbstract[]) {
        this.whFloorInfo = whFloorInfo;
        this.arrivalsInfo = arrivalsInfo;
    }
}


// to get requests vs approval comparision 

export class WhRequestsApprovalCount {
    requestsCount: number; // Total number of requests
    approvedCount: number; // Number of requests that have been approved
    date: string; // Date of the requests approval count

    constructor(requestsCount: number, approvedCount: number, date: string) {
        this.requestsCount = requestsCount;
        this.approvedCount = approvedCount;
        this.date = date;
    }
}


// to get packing list count
export class WhPackListCountInfo {
    whFloorInfo: WhFloorRequest; // Warehouse floor information
    packListInfo: StatusWisePackListCount[]; // Information about pack list counts

    constructor(whFloorInfo: WhFloorRequest, packListInfo: StatusWisePackListCount[]) {
        this.whFloorInfo = whFloorInfo;
        this.packListInfo = packListInfo;
    }
}

export class StatusWisePackListCount {
    totalPackListsInWarehouse: number; // Total number of pack lists in the warehouse
    noOfCartonsInWh: number; // Number of cartons in the warehouse
    totalMOCountInWh: number; // Total number of Manufacturing orders in the warehouse

    constructor(
        totalPackListsInWarehouse: number,
        noOfCartonsInWh: number,
        totalMOCountInWh: number
    ) {
        this.totalPackListsInWarehouse = totalPackListsInWarehouse;
        this.noOfCartonsInWh = noOfCartonsInWh;
        this.totalMOCountInWh = totalMOCountInWh;
    }
}


// to get requests and rejection percentage 

export class WhRequestsRejectionPercentage {
    requestsCount: number; // Total number of requests
    rejectionCount: number; // Number of rejected requests
    rejectionPercentage: number; // Percentage of requests rejected
    approvalPercentage: number; // Percentage of requests approved

    constructor(
        requestsCount: number,
        rejectionCount: number,
        rejectionPercentage: number,
        approvalPercentage: number
    ) {
        this.requestsCount = requestsCount;
        this.rejectionCount = rejectionCount;
        this.rejectionPercentage = rejectionPercentage;
        this.approvalPercentage = approvalPercentage;
    }
}

export class WhRequestDashboardInfoModel {
    progressWiseReqCountInfo: ProgressWiseRequestsCount; // Holds progress-wise request count details
    arrivalsInfo: WhRequestsArrivalInfoAbstractForWhAndFloor[]; // Array of arrivals information for warehouse and floor
    departuresInfo: WhRequestsDepartureInfoAbstractForWhAndFloor[]; // Array of departures information for warehouse and floor
    packListInfo: WhPackListCountInfo[]; // Pack list count details for warehouse and floor
    rejApprovePercentageInfo: WhRequestsRejectionPercentage[]; // Rejection and approval percentages for warehouse requests
    WhRequestsApprovalCountInfo: WhRequestsApprovalCount[]; // requests vs approval comparision
    constructor(
        progressWiseReqCountInfo: ProgressWiseRequestsCount,
        arrivalsInfo: WhRequestsArrivalInfoAbstractForWhAndFloor[],
        departuresInfo: WhRequestsDepartureInfoAbstractForWhAndFloor[],
        packListInfo: WhPackListCountInfo[],
        rejApprovePercentageInfo: WhRequestsRejectionPercentage[],
        WhRequestsApprovalCountInfo: WhRequestsApprovalCount[]
    ) {
        this.progressWiseReqCountInfo = progressWiseReqCountInfo;
        this.arrivalsInfo = arrivalsInfo;
        this.departuresInfo = departuresInfo;
        this.packListInfo = packListInfo;
        this.rejApprovePercentageInfo = rejApprovePercentageInfo;
        this.WhRequestsApprovalCountInfo = WhRequestsApprovalCountInfo;
    }
}







