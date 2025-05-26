import { PKMSInspectionHeaderAttributesEnum, PackFinalInspectionStatusEnum, PackInsMaterialEnum, PackInsMaterialTypeEnum } from "packages/libs/shared-models/src/pkms";

export class PKMSInsDetailsResponseDto {
    attributes: PKMSAttributesNamesAndValues[];
    insCode: string;
    insReqId: number;
    finalInspectionStatus: PackFinalInspectionStatusEnum;
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
    status: PackFinalInspectionStatusEnum;
    area: string;
    inspector: string;
    insMaterialType: PackInsMaterialTypeEnum;
    inMaterial: PackInsMaterialEnum;
    insStartedAt: string;
    materialReceivedAt: string;
    insCompletedAt: string;
    insCartons: PKMSInsSummeryCartonsDto[];
    constructor(
        attributes: PKMSAttributesNamesAndValues[],
        insCode: string,
        insReqId: number,
        finalInspectionStatus: PackFinalInspectionStatusEnum,
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
        status: PackFinalInspectionStatusEnum,
        area: string,
        inspector: string,
        insMaterialType: PackInsMaterialTypeEnum,
        inMaterial: PackInsMaterialEnum,
        insStartedAt: string,
        materialReceivedAt: string,
        insCompletedAt: string,
        insCartons: PKMSInsSummeryCartonsDto[],
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

export class PKMSAttributesNamesAndValues {
    attributeName: PKMSInspectionHeaderAttributesEnum;
    attributeValue: string;
    constructor(
        attributeName: PKMSInspectionHeaderAttributesEnum,
        attributeValue: string,
    ) {
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
    }
}

export class PKMSUploadedFiles {
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

export class PKMSInsSummeryCartonsDto {
    cartonNumber: string;
    cartonId: number;
    grossWeight: number;
    netWeight: number;
    inspectionResult: PackFinalInspectionStatusEnum;
    insGrossWeight: number;
    insNetWeight: number;
    finalInspectionResult: PackFinalInspectionStatusEnum;
    insItemId: number;
    insReqId: number;
    files: PKMSUploadedFiles;
    rejectedReason: number;
    rejectedName: string;
    constructor(
        cartonNumber: string,
        cartonId: number,
        grossWeight: number,
        netWeight: number,
        inspectionResult: PackFinalInspectionStatusEnum,
        insGrossWeight: number,
        insNetWeight: number,
        finalInspectionResult: PackFinalInspectionStatusEnum,
        insItemId: number,
        insReqId: number,
        files: PKMSUploadedFiles,
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


