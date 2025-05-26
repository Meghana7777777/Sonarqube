import { CommonRequestAttrs, GlobalResponseObject, ProcessTypeEnum } from "@xpparel/shared-models";



// In the landing page need to show style -> product code -> processing serial using apis in  SewingProcessingOrderService
// In order to get the unplanned processing jobs need to send the below request 
export class PJP_StyleProductProcessingSerialReq extends CommonRequestAttrs {
    styleCode: string;
    productCode: string;
    processingSerial: number;
    processingType: ProcessTypeEnum;
    constructor(userName: string, unitCode: string, companyCode: string, userId: number, styleCode: string, productCode: string, processingSerial: number, processingType: ProcessTypeEnum) {
        super(userName, unitCode, companyCode, userId);
        this.styleCode = styleCode;
        this.productCode = productCode;
        this.processingSerial = processingSerial;
        this.processingType = processingType;
    }
}

// To show the Un planned jobs in the left hand side box need to use below response
// Need to show the each strip of each job number and in the hover need to show rest
export class PJP_UnPlannedProcessingJobsResponse extends GlobalResponseObject {
    data : PJP_UnPlannedProcessingJobsModel[]
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PJP_UnPlannedProcessingJobsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class PJP_UnPlannedProcessingJobsModel {
    jobNumber: string;
    processType: ProcessTypeEnum;
    procSerial: number;
    productCode: string;
    quantity: number;
    colorSizeQty: PJP_JobColorSizeModel[];
    jobFeatures: PJP_JobFeaturesModel;
    // constructor(jobNumber: string, processType: ProcessTypeEnum, procSerial: number, productCode: string, quantity: number, colorSizeQty: PJP_JobColorSizeModel[], jobFeatures: PJP_JobFeaturesModel) {
    //     this.jobNumber = jobNumber;
    //     this.processType = processType;
    //     this.procSerial = procSerial;
    //     this.productCode = productCode;
    //     this.quantity = quantity;
    //     this.colorSizeQty = colorSizeQty;
    //     this.jobFeatures = jobFeatures;
    // }
}

export class PJP_JobFeaturesModel {
    style: string;
    color: string[];
    delDate: string[];
    vpo: string[];
    soNo: string[];
    destination: string[];
    // constructor(style: string, color: string[], delDate: string[], vpo: string[], soNo: string[], destination: string[]) {
    //     this.style = style;
    //     this.color = color;
    //     this.delDate = delDate;
    //     this.vpo = vpo;
    //     this.soNo = soNo;
    //     this.destination = destination;
    // }
}

export class PJP_JobColorSizeModel {
    color: string;
    size: string;
    quantity: number;
    // constructor(color: string, size: string, quantity: number) {
    //     this.color = color;
    //     this.size = size;
    //     this.quantity = quantity;
    // }
}

// To show the already planned job in the planning screen Need to use below request and response
// REQUEST
export class PJP_LocationCodesRequest extends CommonRequestAttrs{
    locationCodes: string[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, locationCodes: string[]) {
        super(username, unitCode, companyCode, userId);
        this.locationCodes = locationCodes;
    }
}

// RESPONSE
// for FR Plan related things need to call API by passing location code  
// For already planned minutes Need to calculate from  PJP_PlannedProcessingJobsModel -> quantity * smv
// For Service related things and downtime need to call ASSET MANAGEMENT by passing locationCodes and date
export class PJP_PlannedProcessingJobsResponse extends GlobalResponseObject {
    data : PJP_LocationWiseJobsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PJP_LocationWiseJobsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


export class PJP_LocationWiseJobsModel {
    locationCode: string;
    planDateWiseJobModel: PJP_PlanDateWiseJobsModel[];
    locationColor?: string
    processingType?: ProcessTypeEnum
    // constructor(locationCode: string, planDateWiseJobModel: PJP_PlanDateWiseJobsModel[], locationColor?: string, processingType?: ProcessTypeEnum) {
    //     this.locationCode = locationCode;
    //     this.planDateWiseJobModel = planDateWiseJobModel;
    //     this.locationColor = locationColor;
    //     this.processingType = processingType;
    // }
}

export class PJP_PlanDateWiseJobsModel {
    plannedDate: string;
    processingJobsModel: PJP_PlannedProcessingJobsModel[];
    // constructor(plannedDate: string, processingJobsModel: PJP_PlannedProcessingJobsModel[]) {
    //     this.plannedDate = plannedDate;
    //     this.processingJobsModel = processingJobsModel;
    // }
}

export class PJP_PlannedProcessingJobsModel {
    jobNumber: string;
    processType: ProcessTypeEnum;
    procSerial: number;
    productCode: string;
    quantity: number;
    colorSizeQty: PJP_JobColorSizeModel[];
    jobFeatures: PJP_JobFeaturesModel;
    totalSmv : number;
    // constructor(jobNumber: string, processType: ProcessTypeEnum, procSerial: number, productCode: string, quantity: number, colorSizeQty: PJP_JobColorSizeModel[], jobFeatures: PJP_JobFeaturesModel, totalSmv : number) {
    //     this.jobNumber = jobNumber;
    //     this.processType = processType;
    //     this.procSerial = procSerial;
    //     this.productCode = productCode;
    //     this.quantity = quantity;
    //     this.colorSizeQty = colorSizeQty;
    //     this.jobFeatures = jobFeatures;
    //     this.totalSmv = totalSmv;
    // }
}


// Once user plans the Job into the location need to follow following models
// Response global response object
export class PJP_ProcessingJobPlanningRequest extends CommonRequestAttrs {
    jobNumber: string;
    locationCode: string;
    plannedDate: Date;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNumber: string, locationCode: string, plannedDate: Date) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.locationCode = locationCode;
        this.plannedDate = plannedDate; 
    }
}

