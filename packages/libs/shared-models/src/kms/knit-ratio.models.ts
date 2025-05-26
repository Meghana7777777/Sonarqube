import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";

export class KC_KnitRatioCreationRequest extends CommonRequestAttrs {
    processingSerial: number;
    productName: string;
    knitRatios: KC_KnitGroupRatioModel[];
    processType: ProcessTypeEnum;
    ratioName: string;
    remarks: string;


    /**
     * Constructor for KC_KnitRatioCreationRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User's ID
     * @param date - Optional date
     * @param processingSerial - Unique identifier for the processing serial
     * @param productName - Name of the product
     * @param knitRatios - List of knit group ratios
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        productName: string,
        knitRatios: KC_KnitGroupRatioModel[],
        processType: ProcessTypeEnum,
        ratioName: string,
        remarks: string

    ) {
        super(username, unitCode, companyCode, userId); // Initialize parent class properties
        this.processingSerial = processingSerial;
        this.productName = productName;
        this.knitRatios = knitRatios;
        this.processType = processType;
        this.ratioName = ratioName;
        this.remarks = remarks;
    }
}



export class KC_KnitGroupRatioModel {
    ratioId?: number; // Not required during creation
    ratioName: string;
    ratioCode: string;
    knitGroup: string;
    productType: string;
    productCode: string;
    productName: string;
    processingSerial: number;
    fgColor: string;
    highLevelKnitJobQty: number; // Common knit job quantity
    sizeRatios: KC_KnitGroupSizeRatioModel[];
    ratioStatus: KC_KnitGroupRatioStatusModel;
    itemCodes: string[];
    components: string[];
    remarks: string;



    /**
     * Constructor for KC_KnitGroupRatioModel
     * @param knitGroup - Name of the knit group
     * @param productType - Type of product
     * @param productCode - Product code
     * @param productName - Product name
     * @param processingSerial - Serial number of processing
     * @param fgColor - Finished goods color
     * @param highLevelKnitJobQty - Common knit job quantity
     * @param sizeRatios - Array of size ratio models
     * @param ratioStatus - Status of the knit group ratio
     * @param ratioId - Optional ratio ID (Not required during creation)
     */
    constructor(
        knitGroup: string,
        productType: string,
        productCode: string,
        productName: string,
        processingSerial: number,
        fgColor: string,
        highLevelKnitJobQty: number,
        sizeRatios: KC_KnitGroupSizeRatioModel[],
        ratioStatus: KC_KnitGroupRatioStatusModel,
        itemCodes: string[],
        components: string[],
        ratioName?: string,
        ratioCode?: string,
        ratioId?: number,
        remarks?: string
    ) {
        this.ratioId = ratioId;
        this.knitGroup = knitGroup;
        this.productType = productType;
        this.productCode = productCode;
        this.productName = productName;
        this.processingSerial = processingSerial;
        this.fgColor = fgColor;
        this.highLevelKnitJobQty = highLevelKnitJobQty;
        this.sizeRatios = sizeRatios;
        this.itemCodes = itemCodes;
        this.components = components;
        this.ratioStatus = ratioStatus;
        this.ratioCode = ratioCode;
        this.ratioName = ratioName;
        this.remarks = remarks;
    }
}




export class KC_KnitGroupSizeRatioModel {
    size: string;
    ratioQty: number; // The sub-quantity of the knit processing order
    jobQty: number; // Job quantity per size
    logicalBundleQty: number

    /**
     * Constructor for KC_KnitGroupSizeRatioModel
     * @param size - Size of the product
     * @param ratioQty - The sub-quantity of the knit processing order
     * @param jobQty - Job quantity per size
     */
    constructor(size: string, ratioQty: number, jobQty: number, logicalBundleQty: number) {
        this.size = size;
        this.ratioQty = ratioQty;
        this.jobQty = jobQty;
        this.logicalBundleQty = logicalBundleQty;
    }
}




export class KC_KnitGroupRatioResponse extends GlobalResponseObject {
    data?: KC_KnitGroupRatioModel[];

    /**
     * Constructor for KC_KnitGroupRatioResponse
     * @param status - Response status
     * @param errorCode - Error code
     * @param internalMessage - Internal message
     * @param data - Array of KC_KnitGroupRatioModel (optional)
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KC_KnitGroupRatioModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



export class KC_KnitGroupRatioIdRequest extends CommonRequestAttrs {
    ratioId: number;
}


export class KC_KnitGroupRatioStatusModel {
    jobsGenStatus: KC_KnitJobGenStatusEnum;
    jobConfStatus: KC_KnitJobConfStatusEnum;

    /**
     * Constructor for KC_KnitGroupRatioStatusModel
     * @param jobsGenStatus - Status of job generation
     * @param jobConfStatus - Status of job confirmation
     */
    constructor(jobsGenStatus: KC_KnitJobGenStatusEnum, jobConfStatus: KC_KnitJobConfStatusEnum) {
        this.jobsGenStatus = jobsGenStatus;
        this.jobConfStatus = jobConfStatus;
    }
}



export enum KC_KnitJobGenStatusEnum {
    OPEN = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2
}

export enum KC_KnitJobConfStatusEnum {
    OPEN = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2
}

export const KC_KnitJobGenStatusViewObj = {
    0: "Open",
    1: "In Progress",
    2: "Completed"

}

export const KC_KnitJobConfStatusViewObj = {
    0: "Open",
    1: "In Progress",
    2: "Completed"
}

