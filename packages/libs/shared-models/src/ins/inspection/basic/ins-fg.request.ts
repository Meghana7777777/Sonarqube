import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import {CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { PKMSUploadedFiles } from "packages/libs/shared-models/src/pkms";

export class FgInspectionRequest extends CommonRequestAttrs {
    insReqId:number;
    inspector: string;
    area: string;
    insStartedAt: string;
    insCompletedAt: string;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    insCartons: InspectionServiceW[];
    constructor(
        inspector: string,
        area: string,
        insStartedAt: string,
        insCompletedAt: string,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        insCartons: InspectionServiceW[],
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        insReqId:number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.inspector = inspector;
        this.area = area;
        this.insStartedAt = insStartedAt;
        this.insCompletedAt = insCompletedAt;
        this.finalInspectionStatus = finalInspectionStatus;
        this.insCartons = insCartons;
        this.insReqId=insReqId;
    }
}

export class InspectionServiceW {
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
    files: PKMSUploadedFiles;
    rejectedReason: number;
    rejectedName: string;
    insActicityStaus:InsInspectionActivityStatusEnum;
    constructor(
        cartonNumber: string,
        cartonId: number,
        grossWeight: number,
        netWeight: number,
        inspectionResult: InsInspectionFinalInSpectionStatusEnum,
        finalInspectionResult: InsInspectionFinalInSpectionStatusEnum,
        insItemId: number,
        insReqId: number,
        files: PKMSUploadedFiles,
        rejectedReason: number,
        rejectedName: string,
        insActicityStaus:InsInspectionActivityStatusEnum,
    ) {
        this.cartonNumber = cartonNumber;
        this.cartonId = cartonId;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.inspectionResult = inspectionResult;
        this.finalInspectionResult = finalInspectionResult;
        this.insItemId = insItemId;
        this.insReqId = insReqId;
        this.files = files;
        this.rejectedReason = rejectedReason;
        this.rejectedName = rejectedName;
        this.insActicityStaus=insActicityStaus;
    }
}
