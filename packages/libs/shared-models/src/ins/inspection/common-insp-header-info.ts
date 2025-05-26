import { InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "../enum";
import { InsAttributeNameValueModel } from "./attribute-name-value";



export class InsCommonInspectionHeaderInfo {
    inspectionReqId: number;
    inspRequestCategory: InsFabricInspectionRequestCategoryEnum;
    batchNo: string;
    totalNoOfBatchRolls: number;
    totalNoOfRequestRolls: number;
    totalNoOfInspectedRolls: number;
    inspectionPercentage: number;
    lotNo: string;
    batchQty: number;
    inspectionQty: number;
    inspectedQty: number;
    inspectedDate: Date;
    inspectionStart: Date;
    inspectionCompleteAt: Date;
    expInspectionCompleteAt?: Date;
    inspector: string;
    inspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    fabricComposition: string;
    lab: string;
    headerAttributes: InsAttributeNameValueModel[];
    createReRequest: boolean;

    constructor(inspectionReqId: number,
        inspRequestCategory: InsFabricInspectionRequestCategoryEnum,
        batchNo: string,
        totalNoOfBatchRolls: number,
        totalNoOfRequestRolls: number,
        totalNoOfInspectedRolls: number,
        inspectionPercentage: number,
        lotNo: string,
        inspectionQty: number,
        inspectedQty: number,
        inspectedDate: Date,
        inspectionStart: Date,
        inspectionCompleteAt: Date,
        inspector: string,
        inspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        fabricComposition: string,
        headerAttributes: InsAttributeNameValueModel[], 
        createReRequest: boolean,
        expInspectionCompleteAt?: Date,
        batchQty?: number,
        lab?: string,) {
        this.inspectionReqId = inspectionReqId;
        this.inspRequestCategory = inspRequestCategory;
        this.batchNo = batchNo;
        this.totalNoOfBatchRolls = totalNoOfBatchRolls;
        this.totalNoOfRequestRolls = totalNoOfRequestRolls;
        this.totalNoOfInspectedRolls = totalNoOfInspectedRolls;
        this.inspectionPercentage = inspectionPercentage;
        this.lotNo = lotNo;
        this.batchQty = batchQty;
        this.inspectionQty = inspectionQty;
        this.inspectedQty = inspectedQty;
        this.inspectedDate = inspectedDate;
        this.inspectionStart = inspectionStart;
        this.inspectionCompleteAt = inspectionCompleteAt;
        this.expInspectionCompleteAt = expInspectionCompleteAt;
        this.inspector = inspector;
        this.inspectionStatus = inspectionStatus;
        this.fabricComposition = fabricComposition;
        this.lab = lab;
        this.headerAttributes = headerAttributes;
        this.createReRequest = createReRequest;
    }

} 


export class YarnInsCommonInspectionHeaderInfo {
    inspectionReqId: number;
    inspRequestCategory: YarnTypeEnum;
    batchNo: string;
    totalNoOfBatchRolls: number;
    totalNoOfRequestRolls: number;
    totalNoOfInspectedRolls: number;
    inspectionPercentage: number;
    lotNo: string;
    batchQty: number;
    inspectionQty: number;
    inspectedQty: number;
    inspectedDate: Date;
    inspectionStart: Date;
    inspectionCompleteAt: Date;
    expInspectionCompleteAt?: Date;
    inspector: string;
    inspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    fabricComposition: string;
    lab: string;
    headerAttributes: InsAttributeNameValueModel[];
    createReRequest: boolean;

    constructor(inspectionReqId: number,
        inspRequestCategory: YarnTypeEnum,
        batchNo: string,
        totalNoOfBatchRolls: number,
        totalNoOfRequestRolls: number,
        totalNoOfInspectedRolls: number,
        inspectionPercentage: number,
        lotNo: string,
        inspectionQty: number,
        inspectedQty: number,
        inspectedDate: Date,
        inspectionStart: Date,
        inspectionCompleteAt: Date,
        inspector: string,
        inspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        fabricComposition: string,
        headerAttributes: InsAttributeNameValueModel[], 
        createReRequest: boolean,
        expInspectionCompleteAt?: Date,
        batchQty?: number,
        lab?: string,) {
        this.inspectionReqId = inspectionReqId;
        this.inspRequestCategory = inspRequestCategory;
        this.batchNo = batchNo;
        this.totalNoOfBatchRolls = totalNoOfBatchRolls;
        this.totalNoOfRequestRolls = totalNoOfRequestRolls;
        this.totalNoOfInspectedRolls = totalNoOfInspectedRolls;
        this.inspectionPercentage = inspectionPercentage;
        this.lotNo = lotNo;
        this.batchQty = batchQty;
        this.inspectionQty = inspectionQty;
        this.inspectedQty = inspectedQty;
        this.inspectedDate = inspectedDate;
        this.inspectionStart = inspectionStart;
        this.inspectionCompleteAt = inspectionCompleteAt;
        this.expInspectionCompleteAt = expInspectionCompleteAt;
        this.inspector = inspector;
        this.inspectionStatus = inspectionStatus;
        this.fabricComposition = fabricComposition;
        this.lab = lab;
        this.headerAttributes = headerAttributes;
        this.createReRequest = createReRequest;
    }

} 

export class    ThreadInsCommonInspectionHeaderInfo {
    inspectionReqId: number;
    inspRequestCategory: ThreadTypeEnum;
    batchNo: string;
    totalNoOfBatchRolls: number;
    totalNoOfRequestRolls: number;
    totalNoOfInspectedRolls: number;
    inspectionPercentage: number;
    lotNo: string;
    batchQty: number;
    inspectionQty: number;
    inspectedQty: number;
    inspectedDate: Date;
    inspectionStart: Date;
    inspectionCompleteAt: Date;
    expInspectionCompleteAt?: Date;
    inspector: string;
    inspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    fabricComposition: string;
    lab: string;
    headerAttributes: InsAttributeNameValueModel[];
    createReRequest: boolean;

    constructor(inspectionReqId: number,
        inspRequestCategory: ThreadTypeEnum,
        batchNo: string,
        totalNoOfBatchRolls: number,
        totalNoOfRequestRolls: number,
        totalNoOfInspectedRolls: number,
        inspectionPercentage: number,
        lotNo: string,
        inspectionQty: number,
        inspectedQty: number,
        inspectedDate: Date,
        inspectionStart: Date,
        inspectionCompleteAt: Date,
        inspector: string,
        inspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        fabricComposition: string,
        headerAttributes: InsAttributeNameValueModel[], 
        createReRequest: boolean,
        expInspectionCompleteAt?: Date,
        batchQty?: number,
        lab?: string,) {
        this.inspectionReqId = inspectionReqId;
        this.inspRequestCategory = inspRequestCategory;
        this.batchNo = batchNo;
        this.totalNoOfBatchRolls = totalNoOfBatchRolls;
        this.totalNoOfRequestRolls = totalNoOfRequestRolls;
        this.totalNoOfInspectedRolls = totalNoOfInspectedRolls;
        this.inspectionPercentage = inspectionPercentage;
        this.lotNo = lotNo;
        this.batchQty = batchQty;
        this.inspectionQty = inspectionQty;
        this.inspectedQty = inspectedQty;
        this.inspectedDate = inspectedDate;
        this.inspectionStart = inspectionStart;
        this.inspectionCompleteAt = inspectionCompleteAt;
        this.expInspectionCompleteAt = expInspectionCompleteAt;
        this.inspector = inspector;
        this.inspectionStatus = inspectionStatus;
        this.fabricComposition = fabricComposition;
        this.lab = lab;
        this.headerAttributes = headerAttributes;
        this.createReRequest = createReRequest;
    }

} 


export class TrimInsCommonInspectionHeaderInfo {
    inspectionReqId: number;
    inspRequestCategory: TrimTypeEnum;
    batchNo: string;
    totalNoOfBatchRolls: number;
    totalNoOfRequestRolls: number;
    totalNoOfInspectedRolls: number;
    inspectionPercentage: number;
    lotNo: string;
    batchQty: number;
    inspectionQty: number;
    inspectedQty: number;
    inspectedDate: Date;
    inspectionStart: Date;
    inspectionCompleteAt: Date;
    expInspectionCompleteAt?: Date;
    inspector: string;
    inspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    fabricComposition: string;
    lab: string;
    headerAttributes: InsAttributeNameValueModel[];
    createReRequest: boolean;

    constructor(inspectionReqId: number,
        inspRequestCategory: TrimTypeEnum,
        batchNo: string,
        totalNoOfBatchRolls: number,
        totalNoOfRequestRolls: number,
        totalNoOfInspectedRolls: number,
        inspectionPercentage: number,
        lotNo: string,
        inspectionQty: number,
        inspectedQty: number,
        inspectedDate: Date,
        inspectionStart: Date,
        inspectionCompleteAt: Date,
        inspector: string,
        inspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        fabricComposition: string,
        headerAttributes: InsAttributeNameValueModel[], 
        createReRequest: boolean,
        expInspectionCompleteAt?: Date,
        batchQty?: number,
        lab?: string,) {
        this.inspectionReqId = inspectionReqId;
        this.inspRequestCategory = inspRequestCategory;
        this.batchNo = batchNo;
        this.totalNoOfBatchRolls = totalNoOfBatchRolls;
        this.totalNoOfRequestRolls = totalNoOfRequestRolls;
        this.totalNoOfInspectedRolls = totalNoOfInspectedRolls;
        this.inspectionPercentage = inspectionPercentage;
        this.lotNo = lotNo;
        this.batchQty = batchQty;
        this.inspectionQty = inspectionQty;
        this.inspectedQty = inspectedQty;
        this.inspectedDate = inspectedDate;
        this.inspectionStart = inspectionStart;
        this.inspectionCompleteAt = inspectionCompleteAt;
        this.expInspectionCompleteAt = expInspectionCompleteAt;
        this.inspector = inspector;
        this.inspectionStatus = inspectionStatus;
        this.fabricComposition = fabricComposition;
        this.lab = lab;
        this.headerAttributes = headerAttributes;
        this.createReRequest = createReRequest;
    }

} 