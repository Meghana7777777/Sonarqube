import { WhMatReqLineStatusEnum } from "../../wms";

export class PlannedDocketGroupDocketsHelperModel {
    docNumber: string;
    components: string[];
    productName: string;
    color: string;
    destination: string;
    moLine: string;
    exFactory: string;
    cutNumber: string;
    cutSubNumber: string;

    constructor(
        docNumber: string,
        components: string[],
        productName: string,
        color: string,
        destination: string,
        moLine: string,
        exFactory: string,
        cutNumber: string,
        cutSubNumber: string,
    ) {
        this.docNumber = docNumber;
        this.components = components;
        this.productName = productName;
        this.color = color;
        this.destination = destination;
        this.moLine = moLine;
        this.exFactory = exFactory;
        this.cutNumber = cutNumber;
        this.cutSubNumber = cutSubNumber;
    }
}

export class PlannedDocketGroupModel {
    docGroupId: number;
    docketGroup: string;
    matReqNo: string; // the po docket material req no 
    plannedDateTime: string;
    pPlies: number;
    layPlies: number;
    cutPlies: number;
    requestedQty: number;
    materialStatus: WhMatReqLineStatusEnum;
    moNo: string;
    priority: number;
    tableId: string;
    docCreatedAt: string; // time at which the docket is created
    marterialReqAt: string; // time at which the material is req    
    poSerial: number;
    ctPlanId: number;
    matFulFillmentDate: string; // YYYY-MM-DD HH:mm
    plantStyleRef: string;
    docketNumbers: PlannedDocketGroupDocketsHelperModel[];

    constructor(
        docGroupId: number,
        docketGroup: string,
        matReqNo: string,
        plannedDateTime: string,
        pPlies: number,
        layPlies: number,
        cutPlies: number,
        requestedQty: number,
        materialStatus: WhMatReqLineStatusEnum,
        moNo: string,
        priority: number,
        tableId: string,
        docCreatedAt: string,
        marterialReqAt: string,
        poSerial: number,
        ctPlanId: number,
        matFulFillmentDate: string,
        plantStyleRef: string,
        docketNumbers: PlannedDocketGroupDocketsHelperModel[]
    ) {
        this.docGroupId = docGroupId;
        this.docketGroup = docketGroup;
        this.matReqNo = matReqNo;
        this.plannedDateTime = plannedDateTime;
        this.pPlies = pPlies;
        this.layPlies = layPlies;
        this.cutPlies = cutPlies;
        this.requestedQty = requestedQty;
        this.materialStatus = materialStatus;
        this.moNo = moNo;
        this.priority = priority;
        this.tableId = tableId;
        this.docCreatedAt = docCreatedAt;
        this.marterialReqAt = marterialReqAt;
        this.poSerial = poSerial;
        this.ctPlanId = ctPlanId;
        this.matFulFillmentDate = matFulFillmentDate;
        this.plantStyleRef = plantStyleRef;
        this.docketNumbers = docketNumbers;
    }
}