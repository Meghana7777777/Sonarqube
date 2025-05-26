import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KJ_R_KnitJobReportedQtyModel } from "./knit-job-reporting.models";
import { KC_KnitJobColorSizeModel, KC_KnitJobFeatures, KC_KnitJobModel, KC_KnitJobRmModel, KC_ProductSku } from "./knit-job.models";


export class KJ_LocationCodesRequest extends CommonRequestAttrs {
    locationCodes: string[];
    /**
    * Constructor for KJ_KnitJobLocPlanRequest
    * @param username - Username of the requester
    * @param unitCode - Unit code
    * @param companyCode - Company code
    * @param userId - User ID
    * @param date - Optional date
    * @param knitJobs - Array of knit job numbers
    * @param locationCodes - Location ID
    * @param processingSerial - Processing serial number
    * @param processType = Process type
    */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCodes: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCodes = locationCodes
    }
}

export class KJ_LocationCodeQtyModel {
    locationCode: string;
    quantity: number;

    constructor(locationCode: string, quantity: number) {
        this.locationCode = locationCode;
        this.quantity = quantity;
    }
}


export class KJ_LocationCodeWiseQtyResponse extends GlobalResponseObject {
    data: KJ_LocationCodeQtyModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: KJ_LocationCodeQtyModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


// save only 1 workstation jobs info per API
export class KJ_KnitJobLocPlanRequest extends CommonRequestAttrs {
    knitJobs: string[]; // Knit job numbers array
    locationCode: string; // PK of the location/module
    processingSerial: number;
    processType: ProcessTypeEnum;

    /**
     * Constructor for KJ_KnitJobLocPlanRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param date - Optional date
     * @param knitJobs - Array of knit job numbers
     * @param locationCode - Location ID
     * @param processingSerial - Processing serial number
     * @param processType = Process type
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitJobs: string[],
        locationCode: string,
        processingSerial: number,
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.knitJobs = knitJobs;
        this.locationCode = locationCode;
        this.processingSerial = processingSerial;
        this.processType = processType;
    }
}


export class KC_LocationKnitJobModel {
    knitGroup: string;
    jobNumber: string;
    jobQty: number;
    productSpecs: KC_ProductSku;
    processingSerial: number;
    barcodePrinted: boolean;//leave
    materialStatus: KJ_MaterialStatusEnum;
    processType: ProcessTypeEnum;
    jobFeatures: KC_KnitJobFeatures;
    colorSizeInfo: KC_KnitJobColorSizeModel[];
    jobRm: KC_KnitJobRmModel[];

    /**
     * Constructor for KC_LocationKnitJobModel
     * @param knitGroup - Identifier for the knit group
     * @param jobNumber - Job number associated with the knit job
     * @param jobQty - Quantity of the job
     * @param productSpecs - Product specifications
     * @param processingSerial - Processing serial number
     * @param barcodePrinted - Status of barcode printing
     * @param materialStatus - Material status of the job
     */
    constructor(
        knitGroup: string,
        jobNumber: string,
        jobQty: number,
        productSpecs: KC_ProductSku,
        processingSerial: number,
        barcodePrinted: boolean,
        materialStatus: KJ_MaterialStatusEnum,
        processType: ProcessTypeEnum,
        jobFeatures: KC_KnitJobFeatures,
        colorSizeInfo: KC_KnitJobColorSizeModel[],
        jobRm: KC_KnitJobRmModel[],
    ) {
        this.knitGroup = knitGroup;
        this.jobNumber = jobNumber;
        this.jobQty = jobQty;
        this.productSpecs = productSpecs;
        this.processingSerial = processingSerial;
        this.barcodePrinted = barcodePrinted;
        this.materialStatus = materialStatus;
        this.processType = processType;
        this.jobFeatures = jobFeatures;
        this.colorSizeInfo = colorSizeInfo;
        this.jobRm = jobRm;
    }
}



export class KJ_LocationKnitJobsModel {
    locationCode: string;
    knitJobs: KC_LocationKnitJobModel[];

    /**
     * Constructor for KJ_LocationKnitJobsModel
     * @param locationCode - Unique identifier for the location
     * @param knitJobs - List of knit jobs associated with the location
     */
    constructor(locationCode: string, knitJobs: KC_LocationKnitJobModel[]) {
        this.locationCode = locationCode;
        this.knitJobs = knitJobs;
    }
}


export class KJ_locationCodeRequest extends CommonRequestAttrs {
    locationCode: string;
    iNeedFeatures: boolean;
    iNeedColSizes: boolean;
    iNeedBarcode: boolean;
    iNeedBarcodeFeatures: boolean;
    iNeedRmDetails: boolean;


    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCode: string,
        iNeedFeatures: boolean,
        iNeedColSizes: boolean,
        iNeedBarcode: boolean,
        iNeedBarcodeFeatures: boolean,
        iNeedRmDetails: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCode = locationCode;
        this.iNeedFeatures = iNeedFeatures;
        this.iNeedColSizes = iNeedColSizes;
        this.iNeedBarcode = iNeedBarcode;
        this.iNeedBarcodeFeatures = iNeedBarcodeFeatures;
        this.iNeedRmDetails = iNeedRmDetails;
    }
}

export enum KJ_MaterialStatusEnum {
    OPEN = 0,
    REQUESTED = 1,
    PARTIAL_ISSUED = 2,
    COMPLETELY_ISSUED = 4
}
export const kjMaterialStatusEnumDisplayValues = {
    [KJ_MaterialStatusEnum.COMPLETELY_ISSUED]: 'Fully Issued',
    [KJ_MaterialStatusEnum.OPEN]: 'Not Requested',
    [KJ_MaterialStatusEnum.PARTIAL_ISSUED]: 'Partially Issued',
    [KJ_MaterialStatusEnum.REQUESTED]: 'Requested',
}

// only for 1 location
export class KJ_LocationKnitJobsResponse extends GlobalResponseObject {
    data?: KJ_LocationKnitJobsModel[];

    /**
     * Constructor for KJ_LocationKnitJobsResponse
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message related to the response
     * @param data - Optional array of location knit jobs
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: KJ_LocationKnitJobsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



export class KJ_R_LocationKnitJobsSummaryRequest extends CommonRequestAttrs {
    locationCode: string;
    iNeedRmStatuses: boolean;
    iNeedReportingInfo: boolean;
    iNeedBarcodeFeatures: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCode: string,
        iNeedRmStatuses: boolean,
        iNeedReportingInfo: boolean,
        iNeedBarcodeFeatures: boolean,
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCode = locationCode;
        this.iNeedRmStatuses = iNeedRmStatuses;
        this.iNeedReportingInfo = iNeedReportingInfo;
        this.iNeedBarcodeFeatures = iNeedBarcodeFeatures;
    }
}


export class KJ_R_LocationKnitJobsSummaryResponse extends GlobalResponseObject {
    data?: KJ_R_LocationKnitJobsSummaryModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KJ_R_LocationKnitJobsSummaryModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}

export class KJ_R_LocationKnitJobsSummaryModel {
    jobNumber: string;
    jobQty: number;
    knitGroup: string;
    component: string;
    priority: number;
    reportedQtys: KJ_R_KnitJobReportedQtyModel[];
    procSerial: number;
    rmStatus: KJ_MaterialStatusEnum;

    constructor(
        jobNumber: string,
        jobQty: number,
        knitGroup: string,
        component: string,
        priority: number,
        reportedQtys: KJ_R_KnitJobReportedQtyModel[],
        procSerial: number,
        rmStatus: KJ_MaterialStatusEnum
    ) {
        this.jobNumber = jobNumber;
        this.jobQty = jobQty;
        this.knitGroup = knitGroup;
        this.component = component;
        this.priority = priority;
        this.reportedQtys = reportedQtys;
        this.procSerial = procSerial;
        this.rmStatus = rmStatus;
    }
}

export class KnitHeaderInfoModel {
    style: string[];
    styleDesc: string[];
    buyerPo: string[];
    customerName: string[];
    moLines: string[];
    profitCentreName: string[];
    productTypes: string[];
    plantStyleRef: string[];
    productCodes: string[];
    delDates: string[];
    destinations: string[];
    fgColors: string[];
    sizes: string[];
    moNumbers?:string[];
    processingOrderDesc?:string;
    constructor(
        style: string[],
        styleDesc: string[],
        buyerPo: string[],
        customerName: string[],
        moLines: string[],
        profitCentreName: string[],
        productTypes: string[],
        plantStyleRef: string[],
        productCodes: string[],
        delDates: string[],
        destinations: string[],
        fgColors: string[],
        sizes: string[],
        moNumbers?:string[],
        processingOrderDesc?:string
    ) {
        this.style = style;
        this.styleDesc = styleDesc;
        this.buyerPo = buyerPo;
        this.customerName = customerName;
        this.moLines = moLines;
        this.profitCentreName = profitCentreName;
        this.productTypes = productTypes;
        this.plantStyleRef = plantStyleRef;
        this.productCodes = productCodes;
        this.delDates = delDates;
        this.destinations = destinations;
        this.fgColors = fgColors;
        this.sizes = sizes;
        this.moNumbers =  moNumbers;
        this.processingOrderDesc = processingOrderDesc
    }

}

export class KnitHeaderInfoResoponse extends GlobalResponseObject {
    data?: KnitHeaderInfoModel
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KnitHeaderInfoModel
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

