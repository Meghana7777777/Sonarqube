import { InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import { PackFinalInspectionStatusEnum, PackFabricInspectionRequestCategoryEnum } from "packages/libs/shared-models/src/pkms";

export class InsPKMSPendingMaterialResponse {
    insCode: string;
    //parentId
    insReqId: number;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    supplier: string;
    buyerAddress: string;
    style: string;
    poNumber: string;
    packListNo: string;
    insCreationTime: Date;
    isReRequest: boolean;
    totalItemsForInspection: number;

    inspectionType: PackFabricInspectionRequestCategoryEnum;
    materialRecOn: string;
    insCreatedOn: string; // timestamp
    insStartedOn: string; // timestamp
    firstInspectionCompletedOn: string; // timestamp
    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    failedItems: number;
    styleNumber: string;
    batches: string[];
    totalItemsPassed: number;

    constructor(
        insCode: string,
        insReqId: number,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        supplier: string,
        buyerAddress: string,
        style: string,
        poNumber: string,
        packListNo: string,
        insCreationTime: Date,
        isReRequest: boolean,
        totalItemsForInspection: number,

        inspectionType: PackFabricInspectionRequestCategoryEnum,
        materialRecOn: string,
        insCreatedOn: string,
        insStartedOn: string,
        firstInspectionCompletedOn: string,
        materialReceived: boolean,
        inspectionInProgress: boolean,
        inspectionCompleted: boolean,
        failedItems: number,
        styleNumber: string,
        batches: string[],
        totalItemsPassed: number
    ) {
        this.insCode = insCode;
        this.insReqId = insReqId;
        this.finalInspectionStatus = finalInspectionStatus;
        this.supplier = supplier;
        this.buyerAddress = buyerAddress;
        this.style = style;
        this.poNumber = poNumber;
        this.packListNo = packListNo;
        this.insCreationTime = insCreationTime;
        this.isReRequest = isReRequest;
        this.totalItemsForInspection = totalItemsForInspection;
        this.inspectionType = inspectionType;
        this.materialRecOn = materialRecOn;
        this.insCreatedOn = insCreatedOn;
        this.insStartedOn = insStartedOn;
        this.firstInspectionCompletedOn = firstInspectionCompletedOn;
        this.materialReceived = materialReceived;
        this.inspectionInProgress = inspectionInProgress;
        this.inspectionCompleted = inspectionCompleted;
        this.failedItems = failedItems;
        this.styleNumber = styleNumber;
        this.batches = batches;
        this.totalItemsPassed = totalItemsPassed;
    }
}