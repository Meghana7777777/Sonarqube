import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { TrimStatusEnum } from "../enum";

export class IPS_C_LocationCodeRequest extends CommonRequestAttrs {
    locationCode: string[];
    iNeedJobs: boolean;
    iNeedTrimsStatus: boolean;
    iNeedBomReqStatus: boolean;
    iNeedTrackingStatus: boolean;
    iNeedJobFeatures: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCode: string[],
        iNeedJobs: boolean,
        iNeedTrimsStatus: boolean,
        iNeedBomReqStatus: boolean,
        iNeedTrackingStatus: boolean,
        iNeedJobFeatures: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCode = locationCode;
        this.iNeedJobs = iNeedJobs;
        this.iNeedTrimsStatus = iNeedTrimsStatus;
        this.iNeedBomReqStatus = iNeedBomReqStatus;
        this.iNeedTrackingStatus = iNeedTrackingStatus;
        this.iNeedJobFeatures = iNeedJobFeatures;
    }
}

export class IPS_R_LocationJobsResponse extends GlobalResponseObject {
    data?: IPS_R_LocationJobsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: IPS_R_LocationJobsModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



export class IPS_R_LocationJobsModel {
    locationCode: string;
    totalJobs: number;
    jobs: IPS_R_JobModel[];

    constructor(
        locationCode: string,
        totalJobs: number,
        jobs: IPS_R_JobModel[]
    ) {
        this.locationCode = locationCode;
        this.totalJobs = totalJobs;
        this.jobs = jobs;
    }
}



export class IPS_R_JobModel {
    jobNumber: string;
    processType: ProcessTypeEnum;
    procSerial: number;
    productCode: string;
    quantity: number;
    colorSizeQty: IPS_R_JobColorSizeModel[];
    jobFeatures: IPS_R_JobFeaturesModel;
    trimsStatus: IPS_R_JobTrimStatusModel;
    depBomStatus: IPS_R_JobTrimStatusModel;
    depBomItemStatus: IPS_R_JobDepBomItemStatusModel[];
    trackingStatus: IPS_R_JobTrackingStatusModel[];
    status: IPS_R_JobStatusModel;

    constructor(
        jobNumber: string,
        processType: ProcessTypeEnum,
        procSerial: number,
        productCode: string,
        quantity: number,
        colorSizeQty: IPS_R_JobColorSizeModel[],
        jobFeatures: IPS_R_JobFeaturesModel,
        trimsStatus: IPS_R_JobTrimStatusModel,
        depBomItemStatus: IPS_R_JobDepBomItemStatusModel[],
        trackingStatus: IPS_R_JobTrackingStatusModel[],
        status: IPS_R_JobStatusModel,
        depBomStatus: IPS_R_JobTrimStatusModel,
    ) {
        this.jobNumber = jobNumber;
        this.processType = processType;
        this.procSerial = procSerial;
        this.productCode = productCode;
        this.quantity = quantity;
        this.colorSizeQty = colorSizeQty;
        this.jobFeatures = jobFeatures;
        this.trimsStatus = trimsStatus;
        this.depBomItemStatus = depBomItemStatus;
        this.trackingStatus = trackingStatus;
        this.status = status;
        this.depBomStatus = depBomStatus;
    }
}

export class IPS_R_JobStatusModel {
    status: string;
    shape: string;
    color: string;
    wip: number;
    constructor(status: string,
        shape: string,
        color: string,
        wip: number) {
        this.status = status;
        this.shape = shape;
        this.color = color;
        this.wip = wip;
    }
}


export class IPS_R_JobDepBomItemStatusModel {
    depProcType: ProcessTypeEnum;
    requestStatus: TrimStatusEnum; // Has to be replaced with the material status enum
    requestedQty: number;
    issuedQty: number;
    requestedOn: string;
    issuedOn: string;

    constructor(
        depProcType: ProcessTypeEnum,
        requestStatus: any,
        requestedQty: number,
        issuedQty: number,
        requestedOn: string,
        issuedOn: string
    ) {
        this.depProcType = depProcType;
        this.requestStatus = requestStatus;
        this.requestedQty = requestedQty;
        this.issuedQty = issuedQty;
        this.requestedOn = requestedOn;
        this.issuedOn = issuedOn;
    }
}

export class IPS_R_JobColorSizeModel {
    color: string;
    size: string;
    quantity: number;

    constructor(color: string, size: string, quantity: number) {
        this.color = color;
        this.size = size;
        this.quantity = quantity;
    }
}

export class IPS_R_JobTrimStatusModel {
    materialReqOn: string;
    materialIssuedOn: string;
    requestStatus: any; // Has to be replaced with the material status enum

    constructor(materialReqOn: string, materialIssuedOn: string, requestStatus: any) {
        this.materialReqOn = materialReqOn;
        this.materialIssuedOn = materialIssuedOn;
        this.requestStatus = requestStatus;
    }
}

export class IPS_R_JobTrackingStatusModel {
    opGroup: string;
    goodQty: number;
    rejQty: number;

    constructor(opGroup: string, goodQty: number, rejQty: number) {
        this.opGroup = opGroup;
        this.goodQty = goodQty;
        this.rejQty = rejQty;
    }
}

export class IPS_R_JobFeaturesModel {
    style: string;
    color: string[];
    delDate: string[];
    vpo: string[];
    soNo: string[];
    destination: string[];

    constructor(
        style: string,
        color: string[],
        delDate: string[],
        vpo: string[],
        soNo: string[],
        destination: string[]
    ) {
        this.style = style;
        this.color = color;
        this.delDate = delDate;
        this.vpo = vpo;
        this.soNo = soNo;
        this.destination = destination;
    }
}
