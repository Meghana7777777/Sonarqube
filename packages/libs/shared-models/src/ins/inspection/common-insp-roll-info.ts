import { InsInspectionFinalInSpectionStatusEnum } from "../enum";

export class InsCommonInspRollInfo {
    rollId: number;
    externalRollNo: number;
    barcode: string;
    qryCode: string;
    lotNumber: string;
    rollQty: number;
    rollWidth: number;
    rollInsResult: InsInspectionFinalInSpectionStatusEnum;
    rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum;
    rollSampleId ?: number;
    sShade ?: string;
    constructor(rollId: number,
        externalRollNo: number,
        barcode: string,
        qryCode: string,
        lotNumber: string, rollQty: number, rollWidth: number,
        rollInsResult: InsInspectionFinalInSpectionStatusEnum,
        rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum, rollSampleId : number,sShade : string) {
            this.rollId = rollId;
            this.externalRollNo = externalRollNo;
            this.barcode = barcode;
            this.qryCode = qryCode;
            this.lotNumber = lotNumber;
            this.rollQty = rollQty;
            this.rollWidth = rollWidth;
            this.rollInsResult = rollInsResult;
            this.rollFinalInsResult = rollFinalInsResult;
            this.rollSampleId = rollSampleId;
            this.sShade = sShade;
    }
}