import { ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";
import { RollIdRequest } from "../../../wms";
import { InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum } from "../../enum";
export class InsInspectionBasicInfoModel {
    irId: number;
    packListId: number;
    packListCode: string;
    supplierCode: string;
    lotNo: string;
    itemCode: string;
    irCode: string;
    totalItemsForInspection: number;
    totalItemsPassed: number;
    rollIds: RollIdRequest[];
    inspectionType: InsFabricInspectionRequestCategoryEnum;
    materialRecOn: string;
    insCreatedOn: string; // timestamp
    insStartedOn: string; // timestamp
    firstInspectionCompletedOn: string; // timestamp
    batches: string[];

    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    failedItems: number;

    isReRequest: boolean;

    styleNumber:string;

    constructor(irId: number, packListId: number, packListCode: string,  supplierCode: string, lotNo: string, itemCode: string, irCode: string, totalItemsForInspection: number, totalItemsPassed: number, rollIds: RollIdRequest[],
        inspectionType: InsFabricInspectionRequestCategoryEnum, materialRecOn: string, insCreatedOn: string, insStartedOn: string, firstInspectionCompletedOn: string, materialReceived: boolean, inspectionInProgress: boolean, inspectionCompleted: boolean,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum, failedItems: number, batches: string[], isReRequest: boolean,styleNumber:string) {
            this.irId = irId;
            this.packListId = packListId;
            this.packListCode = packListCode;
            this.supplierCode = supplierCode;
            this.lotNo = lotNo;
            this.itemCode = itemCode;
            this.irCode = irCode;
            this.totalItemsForInspection = totalItemsForInspection;
            this.totalItemsPassed = totalItemsPassed;
            this.rollIds = rollIds;
            this.inspectionType = inspectionType;
            this.materialRecOn = materialRecOn;
            this.insStartedOn = insStartedOn;
            this.insCreatedOn = insCreatedOn;
            this.firstInspectionCompletedOn = firstInspectionCompletedOn;
            this.materialReceived = materialReceived;
            this.inspectionInProgress = inspectionInProgress;
            this.inspectionCompleted = inspectionCompleted;
            this.finalInspectionStatus = finalInspectionStatus;
            this.failedItems = failedItems;
            this.batches = batches;
            this.isReRequest = isReRequest;
            this.styleNumber=styleNumber;
    }
}




export class YarnInspectionBasicInfoModel {
    irId: number;
    packListId: number;
    packListCode: string;
    supplierCode: string;
    lotNo: string;
    itemCode: string;
    irCode: string;
    totalItemsForInspection: number;
    totalItemsPassed: number;
    rollIds: RollIdRequest[];
    inspectionType: YarnTypeEnum;
    materialRecOn: string;
    insCreatedOn: string; // timestamp
    insStartedOn: string; // timestamp
    firstInspectionCompletedOn: string; // timestamp
    batches: string[];

    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    failedItems: number;

    isReRequest: boolean;

    styleNumber:string;

    constructor(irId: number, packListId: number, packListCode: string,  supplierCode: string, lotNo: string, itemCode: string, irCode: string, totalItemsForInspection: number, totalItemsPassed: number, rollIds: RollIdRequest[],
        inspectionType: YarnTypeEnum, materialRecOn: string, insCreatedOn: string, insStartedOn: string, firstInspectionCompletedOn: string, materialReceived: boolean, inspectionInProgress: boolean, inspectionCompleted: boolean,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum, failedItems: number, batches: string[], isReRequest: boolean,styleNumber:string) {
            this.irId = irId;
            this.packListId = packListId;
            this.packListCode = packListCode;
            this.supplierCode = supplierCode;
            this.lotNo = lotNo;
            this.itemCode = itemCode;
            this.irCode = irCode;
            this.totalItemsForInspection = totalItemsForInspection;
            this.totalItemsPassed = totalItemsPassed;
            this.rollIds = rollIds;
            this.inspectionType = inspectionType;
            this.materialRecOn = materialRecOn;
            this.insStartedOn = insStartedOn;
            this.insCreatedOn = insCreatedOn;
            this.firstInspectionCompletedOn = firstInspectionCompletedOn;
            this.materialReceived = materialReceived;
            this.inspectionInProgress = inspectionInProgress;
            this.inspectionCompleted = inspectionCompleted;
            this.finalInspectionStatus = finalInspectionStatus;
            this.failedItems = failedItems;
            this.batches = batches;
            this.isReRequest = isReRequest;
            this.styleNumber=styleNumber;
    }
} 


export class ThreadInspectionBasicInfoModel {
    irId: number;
    packListId: number;
    packListCode: string;
    supplierCode: string;
    lotNo: string;
    itemCode: string;
    irCode: string;
    totalItemsForInspection: number;
    totalItemsPassed: number;
    rollIds: RollIdRequest[];
    inspectionType: ThreadTypeEnum;
    materialRecOn: string;
    insCreatedOn: string; // timestamp
    insStartedOn: string; // timestamp
    firstInspectionCompletedOn: string; // timestamp
    batches: string[];

    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    failedItems: number;

    isReRequest: boolean;

    styleNumber:string;

    constructor(irId: number, packListId: number, packListCode: string,  supplierCode: string, lotNo: string, itemCode: string, irCode: string, totalItemsForInspection: number, totalItemsPassed: number, rollIds: RollIdRequest[],
        inspectionType: ThreadTypeEnum, materialRecOn: string, insCreatedOn: string, insStartedOn: string, firstInspectionCompletedOn: string, materialReceived: boolean, inspectionInProgress: boolean, inspectionCompleted: boolean,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum, failedItems: number, batches: string[], isReRequest: boolean,styleNumber:string) {
            this.irId = irId;
            this.packListId = packListId;
            this.packListCode = packListCode;
            this.supplierCode = supplierCode;
            this.lotNo = lotNo;
            this.itemCode = itemCode;
            this.irCode = irCode;
            this.totalItemsForInspection = totalItemsForInspection;
            this.totalItemsPassed = totalItemsPassed;
            this.rollIds = rollIds;
            this.inspectionType = inspectionType;
            this.materialRecOn = materialRecOn;
            this.insStartedOn = insStartedOn;
            this.insCreatedOn = insCreatedOn;
            this.firstInspectionCompletedOn = firstInspectionCompletedOn;
            this.materialReceived = materialReceived;
            this.inspectionInProgress = inspectionInProgress;
            this.inspectionCompleted = inspectionCompleted;
            this.finalInspectionStatus = finalInspectionStatus;
            this.failedItems = failedItems;
            this.batches = batches;
            this.isReRequest = isReRequest;
            this.styleNumber=styleNumber;
    }
} 


export class TrimInspectionBasicInfoModel {
    irId: number;
    packListId: number;
    packListCode: string;
    supplierCode: string;
    lotNo: string;
    itemCode: string;
    irCode: string;
    totalItemsForInspection: number;
    totalItemsPassed: number;
    rollIds: RollIdRequest[];
    inspectionType: TrimTypeEnum;
    materialRecOn: string;
    insCreatedOn: string; // timestamp
    insStartedOn: string; // timestamp
    firstInspectionCompletedOn: string; // timestamp
    batches: string[];

    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    failedItems: number;

    isReRequest: boolean;

    styleNumber:string;

    constructor(irId: number, packListId: number, packListCode: string,  supplierCode: string, lotNo: string, itemCode: string, irCode: string, totalItemsForInspection: number, totalItemsPassed: number, rollIds: RollIdRequest[],
        inspectionType: TrimTypeEnum, materialRecOn: string, insCreatedOn: string, insStartedOn: string, firstInspectionCompletedOn: string, materialReceived: boolean, inspectionInProgress: boolean, inspectionCompleted: boolean,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum, failedItems: number, batches: string[], isReRequest: boolean,styleNumber:string) {
            this.irId = irId;
            this.packListId = packListId;
            this.packListCode = packListCode;
            this.supplierCode = supplierCode;
            this.lotNo = lotNo;
            this.itemCode = itemCode;
            this.irCode = irCode;
            this.totalItemsForInspection = totalItemsForInspection;
            this.totalItemsPassed = totalItemsPassed;
            this.rollIds = rollIds;
            this.inspectionType = inspectionType;
            this.materialRecOn = materialRecOn;
            this.insStartedOn = insStartedOn;
            this.insCreatedOn = insCreatedOn;
            this.firstInspectionCompletedOn = firstInspectionCompletedOn;
            this.materialReceived = materialReceived;
            this.inspectionInProgress = inspectionInProgress;
            this.inspectionCompleted = inspectionCompleted;
            this.finalInspectionStatus = finalInspectionStatus;
            this.failedItems = failedItems;
            this.batches = batches;
            this.isReRequest = isReRequest;
            this.styleNumber=styleNumber;
    }
}  



