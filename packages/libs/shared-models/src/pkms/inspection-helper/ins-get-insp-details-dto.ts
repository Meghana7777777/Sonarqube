import { InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributes, InsInspectionMaterialEnum, InsInspectionMaterialTypeEnum } from "@xpparel/shared-models";

export class InsPKMSInsDetailsResponseDto {
    attributes: InsPKMSAttributesNamesAndValues[];
    insCode: string;
    insReqId: number;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    insCreationTime: Date;
    totalItemsForInspection: number;
    insCreatedOn: string;
    insStartedOn: string;
    firstInspectionCompletedOn: string;
    materialReceived: boolean;
    inspectionInProgress: boolean;
    inspectionCompleted: boolean;
    failedItems: number;
    totalItemsPassed: number;
    status: InsInspectionFinalInSpectionStatusEnum;
    area: string;
    inspector: string;
    insMaterialType: InsInspectionMaterialTypeEnum;
    inMaterial: InsInspectionMaterialEnum;
    insStartedAt: string;
    materialReceivedAt: string;
    insCompletedAt: string;
    insCartons: InsPKMSInsSummeryCartonsDto[];
    constructor(
        attributes: InsPKMSAttributesNamesAndValues[],
        insCode: string,
        insReqId: number,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        insCreationTime: Date,
        totalItemsForInspection: number,
        insCreatedOn: string,
        insStartedOn: string,
        firstInspectionCompletedOn: string,
        materialReceived: boolean,
        inspectionInProgress: boolean,
        inspectionCompleted: boolean,
        failedItems: number,
        totalItemsPassed: number,
        status: InsInspectionFinalInSpectionStatusEnum,
        area: string,
        inspector: string,
        insMaterialType: InsInspectionMaterialTypeEnum,
        inMaterial: InsInspectionMaterialEnum,
        insStartedAt: string,
        materialReceivedAt: string,
        insCompletedAt: string,
        insCartons: InsPKMSInsSummeryCartonsDto[],
    ) {
        this.attributes = attributes;
        this.insCode = insCode;
        this.insReqId = insReqId;
        this.finalInspectionStatus = finalInspectionStatus;
        this.insCreationTime = insCreationTime;
        this.totalItemsForInspection = totalItemsForInspection;
        this.insCreatedOn = insCreatedOn;
        this.insStartedOn = insStartedOn;
        this.firstInspectionCompletedOn = firstInspectionCompletedOn;
        this.materialReceived = materialReceived;
        this.inspectionInProgress = inspectionInProgress;
        this.inspectionCompleted = inspectionCompleted;
        this.failedItems = failedItems;
        this.totalItemsPassed = totalItemsPassed;
        this.status = status;
        this.area = area;
        this.inspector = inspector;
        this.insMaterialType = insMaterialType;
        this.inMaterial = inMaterial;
        this.insStartedAt = insStartedAt;
        this.materialReceivedAt = materialReceivedAt;
        this.insCompletedAt = insCompletedAt;
        this.insCartons = insCartons;
    }
}

export class InsPKMSAttributesNamesAndValues {
    attributeName: InsInspectionHeaderAttributes;
    attributeValue: string;
    constructor(
        attributeName: InsInspectionHeaderAttributes,
        attributeValue: string,
    ) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
    }
}

export class InsPKMSUploadedFiles {
    fileName: string;
    id: number;
    constructor(
        fileName: string,
        id: number
    ) {
        this.fileName = fileName
        this.id = id
    }

}

export class InsPKMSInsSummeryCartonsDto {
    cartonNumber: string;
    cartonId: number;
    grossWeight: number;
    netWeight: number;
    inspectionResult: InsInspectionFinalInSpectionStatusEnum;
    insGrossWeight: number;
    insNetWeight: number;
    finalInspectionResult: InsInspectionFinalInSpectionStatusEnum;
    insItemId: number;
    insReqId: number;
    files: InsPKMSUploadedFiles;
    rejectedReason: number;
    rejectedName: string;
    constructor(
        cartonNumber: string,
        cartonId: number,
        grossWeight: number,
        netWeight: number,
        inspectionResult: InsInspectionFinalInSpectionStatusEnum,
        insGrossWeight: number,
        insNetWeight: number,
        finalInspectionResult: InsInspectionFinalInSpectionStatusEnum,
        insItemId: number,
        insReqId: number,
        files: InsPKMSUploadedFiles,
        rejectedReason: number,
        rejectedName: string,
    ) {
        this.cartonNumber = cartonNumber;
        this.cartonId = cartonId;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.inspectionResult = inspectionResult;
        this.insGrossWeight = insGrossWeight;
        this.insNetWeight = insNetWeight;
        this.finalInspectionResult = finalInspectionResult;
        this.insItemId = insItemId;
        this.insReqId = insReqId;
        this.files = files;
        this.rejectedReason = rejectedReason;
        this.rejectedName = rejectedName;
    }
}


