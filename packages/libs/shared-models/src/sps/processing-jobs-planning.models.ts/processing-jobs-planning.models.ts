import { CommonRequestAttrs, GlobalResponseObject, ProcessTypeEnum } from "@xpparel/shared-models";



// In the landing page need to show style -> product code -> processing serial using apis in  SewingProcessingOrderService
// In order to get the unplanned processing jobs need to send the below request 
export class PJP_StyleProductProcessingSerialReq {
    styleCode: string;
    productCode: string;
    processingSerial: number;
    processingType: ProcessTypeEnum;
}

// To show the Un planned jobs in the left hand side box need to use below response
// Need to show the each strip of each job number and in the hover need to show rest
export class PJP_UnPlannedProcessingJobsResponse extends GlobalResponseObject {
    data : PJP_UnPlannedProcessingJobsModel[]
}

export class PJP_UnPlannedProcessingJobsModel {
    jobNumber: string;
    processType: ProcessTypeEnum;
    procSerial: number;
    productCode: string;
    quantity: number;
    colorSizeQty: PJP_JobColorSizeModel[];
    jobFeatures: PJP_JobFeaturesModel;
}

export class PJP_JobFeaturesModel {
    style: string;
    color: string[];
    delDate: string[];
    vpo: string[];
    soNo: string[];
    destination: string[];
}

export class PJP_JobColorSizeModel {
    color: string;
    size: string;
    quantity: number;
}

// To show the already planned job in the planning screen Need to use below request and response
// REQUEST
export class PJP_SectionCodeRequest extends CommonRequestAttrs{
    sectionCode: string;
}

// RESPONSE
// for FR Plan related things need to call API by passing location code  
// For already planned minutes Need to calculate from  PJP_PlannedProcessingJobsModel -> quantity * smv
// For Service related things and downtime need to call ASSET MANAGEMENT by passing locationCodes and date
export class PJP_PlannedProcessingJobsResponse extends GlobalResponseObject {
    data : PJP_LocationWiseJobsModel[];
}


export class PJP_LocationWiseJobsModel {
    locationCode: string;
    planDateWiseJobModel: PJP_PlanDateWiseJobsModel[];
}

export class PJP_PlanDateWiseJobsModel {
    plannedDate: string;
    processingJobsModel: PJP_PlannedProcessingJobsModel[];
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
}


// Once user plans the Job into the location need to follow following models
// Response global response object
export class PJP_ProcessingJobPlanningRequest extends CommonRequestAttrs {
    jobNumber: string;
    locationCode: string;
}

