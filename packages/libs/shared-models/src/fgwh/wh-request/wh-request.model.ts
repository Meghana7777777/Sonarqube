import { CommonRequestAttrs } from "../../common";
import { PackListCartoonIDs } from "../../pkdms";
import { PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum } from "../../pkms";

export class FgWhSrIdPlIdsRequest extends CommonRequestAttrs {
    plIds: number[]; // Mandatory
    remarks: string; // Remarks field
    iNeedWhReqItems: boolean; // Flag to indicate if warehouse request items are needed
    iNeedWhReqItemAbstract: boolean; // Flag to indicate if abstract details of items are needed
    iNeedWhReqItemAttrs: boolean; // Flag to indicate if item attributes are needed
    iNeedWhReqSubItems: boolean; // Flag to indicate if sub-items are needed
    iNeedWhLocationAbstract: boolean; // Flag to indicate if location abstract details are needed
    fgWhHeaderIds?: number[];// optional if we have headerIds 
    packListCartoonIDs?: PackListCartoonIDs[];
    reqType?: PkmsFgWhReqTypeEnum[]
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        plIds: number[],
        remarks: string,
        iNeedWhReqItems: boolean,
        iNeedWhReqItemAbstract: boolean,
        iNeedWhReqItemAttrs: boolean,
        iNeedWhReqSubItems: boolean,
        iNeedWhLocationAbstract: boolean,
        fgWhHeaderIds?: number[],
        packListCartoonIDs?: PackListCartoonIDs[],
        reqType?: PkmsFgWhReqTypeEnum[]
    ) {
        super(username, unitCode, companyCode, userId); // Call the parent class constructor
        this.plIds = plIds;
        this.remarks = remarks;
        this.iNeedWhReqItems = iNeedWhReqItems;
        this.iNeedWhReqItemAbstract = iNeedWhReqItemAbstract;
        this.iNeedWhReqItemAttrs = iNeedWhReqItemAttrs;
        this.iNeedWhReqSubItems = iNeedWhReqSubItems;
        this.iNeedWhLocationAbstract = iNeedWhLocationAbstract;
        this.fgWhHeaderIds = fgWhHeaderIds;
        this.packListCartoonIDs = packListCartoonIDs;
        this.reqType = reqType;
    }
}



export class FgWhReqHeaderModel {
    reqCode: string; // Request code
    createAt: string; // Creation date
    remarks: string; // Remarks
    refId: string; // Primary key of the reference table
    refType: string; // Type of the reference (e.g., DR/FLOOR/other types)
    approvalStatus: string; // Approval status (can be changed to an enum)
    reqStatus: PkmsFgWhCurrStageEnum; // Request status (can be changed to an enum)
    whReqItems: FgWhReqItemModel[]; // Array of warehouse request items
    requestedDate: string;
    constructor(
        reqCode: string,
        createAt: string,
        remarks: string,
        refId: string,
        refType: string,
        approvalStatus: string,
        reqStatus: PkmsFgWhCurrStageEnum,
        whReqItems: FgWhReqItemModel[],
        requestedDate: string
    ) {
        this.reqCode = reqCode;
        this.createAt = createAt;
        this.remarks = remarks;
        this.refId = refId;
        this.refType = refType;
        this.approvalStatus = approvalStatus;
        this.reqStatus = reqStatus;
        this.whReqItems = whReqItems;
        this.requestedDate = requestedDate;
    }
}


export class FgWhReqItemModel {
    packListId: number; // Packing list ID
    reqLineStatus: string; // Request line status (can be changed to an enum)
    cartonsAbstract: FgWhReqItemAbstract; // Abstract details of the cartons
    whReqItemAttrs: FgWhReqItemAttrs; // Attributes of the warehouse request item
    cartonsInfo: FgWhReqSubItemModel[]; // Information about the cartons
    whAbrstarct: WhBasicInfoModel[]; // Warehouse abstract information

    constructor(
        packListId: number,
        reqLineStatus: string,
        cartonsAbstract: FgWhReqItemAbstract,
        whReqItemAttrs: FgWhReqItemAttrs,
        cartonsInfo: FgWhReqSubItemModel[],
        whAbrstarct: WhBasicInfoModel[]
    ) {
        this.packListId = packListId;
        this.reqLineStatus = reqLineStatus;
        this.cartonsAbstract = cartonsAbstract;
        this.whReqItemAttrs = whReqItemAttrs;
        this.cartonsInfo = cartonsInfo;
        this.whAbrstarct = whAbrstarct;
    }
}


export class WhBasicInfoModel {
    whCode: string; // Warehouse code
    whId: number; // Warehouse ID
    floor: string; // Floor number
    noOfCartons: number;
    address: string;

    constructor(whCode: string, whId: number, floor: string, noOfCartons: number, address: string) {
        this.whCode = whCode;
        this.whId = whId;
        this.floor = floor;
        this.noOfCartons = noOfCartons;
        this.address = address;
    }
}


export class FgWhReqItemAbstract {
    totalCartons: number; // Total number of cartons
    locMapCartons: number; // Number of location-mapped cartons
    locUnMapCartons: number; // Number of location-unmapped cartons
    fgInCartons: number; // Number of finished goods in cartons
    fgOutCartons: number; // Number of finished goods out of cartons

    constructor(
        totalCartons: number,
        locMapCartons: number,
        locUnMapCartons: number,
        fgInCartons: number,
        fgOutCartons: number
    ) {
        this.totalCartons = totalCartons;
        this.locMapCartons = locMapCartons;
        this.locUnMapCartons = locUnMapCartons;
        this.fgInCartons = fgInCartons;
        this.fgOutCartons = fgOutCartons;
    }
}

export class FgWhReqItemAttrs {
    moNo: string; // Manufacturing Order Number
    prodNames: string[]; // Product Names
    poNo: string[]; // Purchase Order Numbers
    styles: string[]; // Styles
    buyers: string[]; // Buyers
    destinations: string[]; // Destinations
    delDates: string[]; // Delivery Dates

    constructor(
        moNo: string,
        prodNames: string[],
        poNo: string[],
        styles: string[],
        buyers: string[],
        destinations: string[],
        delDates: string[]
    ) {
        this.moNo = moNo;
        this.prodNames = prodNames;
        this.poNo = poNo;
        this.styles = styles;
        this.buyers = buyers;
        this.destinations = destinations;
        this.delDates = delDates;
    }
}


export class FgWhReqSubItemModel {
    barcode: string; // Barcode of the carton
    ctnQty: number; // Quantity of items in the carton
    location?: string; // Location of the carton (e.g., rack code + pallet code + bin code)
    loadedInfo?: boolean; // 
    cartonId?: number;
    constructor(barcode: string, ctnQty: number, location?: string, loadedInfo?: boolean, cartonId?: number) {
        this.barcode = barcode;
        this.ctnQty = ctnQty;
        this.location = location;
        this.loadedInfo = loadedInfo;
        this.cartonId = cartonId;
    }
}

