import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum } from "@xpparel/shared-models";
import {CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { PKMSUploadedFiles } from "packages/libs/shared-models/src/pkms";

export class ThreadInspectionCaptureRequest extends CommonRequestAttrs {
    insReqId:number;
    inspector: string;
    area: string;
    insStartedAt: string;
    insCompletedAt: string;
    finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum;
    insSpolls: SpoolsInfo[];
    constructor(
        inspector: string,
        area: string,
        insStartedAt: string,
        insCompletedAt: string,
        finalInspectionStatus: InsInspectionFinalInSpectionStatusEnum,
        insSpolls: SpoolsInfo[],
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
        this.insSpolls = insSpolls;
        this.insReqId=insReqId;
    }
}
// ,,netweight,qnty

export class SpoolsInfo {
    spoolNumber: string;
    spoolId: number;
    netWeight: number;
    insGrossWeight: number; 
    count: number;
    quantity: number;
    tpi: number;
    inspectionResult: InsInspectionFinalInSpectionStatusEnum;
    finalInspectionResult: InsInspectionFinalInSpectionStatusEnum;
    insItemId: number;
    insReqId: number;
    files: PKMSUploadedFiles;
    rejectedReason: number;
    rejectedName: string;
    insActivityStatus: InsInspectionActivityStatusEnum; 

    constructor(
        spoolNumber: string,
        spoolId: number,
        insGrossWeight: number, 
        netWeight: number,
        count: number,
        quantity: number,
        tpi: number,
        inspectionResult: InsInspectionFinalInSpectionStatusEnum,
        finalInspectionResult: InsInspectionFinalInSpectionStatusEnum,
        insItemId: number,
        insReqId: number,
        files: PKMSUploadedFiles,
        rejectedReason: number,
        rejectedName: string,
        insActivityStatus: InsInspectionActivityStatusEnum, 
    ) {
        this.spoolNumber = spoolNumber;
        this.spoolId = spoolId;
        this.insGrossWeight = insGrossWeight;
        this.netWeight = netWeight;
        this.count = count;
        this.quantity = quantity;
        this.tpi = tpi;
        this.inspectionResult = inspectionResult;
        this.finalInspectionResult = finalInspectionResult;
        this.insItemId = insItemId;
        this.insReqId = insReqId;
        this.files = files;
        this.rejectedReason = rejectedReason;
        this.rejectedName = rejectedName;
        this.insActivityStatus = insActivityStatus; 
    }
}

