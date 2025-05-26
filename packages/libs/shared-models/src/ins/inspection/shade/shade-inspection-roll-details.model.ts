import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionResultEnum, InsInspectionStatusEnum } from "../../enum";
import { InsCommonInspRollInfo } from "../common-insp-roll-info";


export class InsShadeInspectionRollDetails extends InsCommonInspRollInfo {
    shade: string;
    actualWidthGroup: string;
    remarks: string;
    inspectionStatus: InsInspectionActivityStatusEnum;
    inspectionResult: InsInspectionFinalInSpectionStatusEnum;
    constructor(rollId: number,
        externalRollNo: number,
        barcode: string,
        qryCode: string, lotNumber: string, rollQty: number,
        rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum,
        shade: string,
        actualWidthGroup: string, remarks: string, inspectionStatus: InsInspectionActivityStatusEnum, inspectionResult: InsInspectionFinalInSpectionStatusEnum) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, null);
        this.shade = shade;
        this.actualWidthGroup = actualWidthGroup;
        this.rollQty = rollQty;
        this.remarks = remarks;
        this.inspectionResult = inspectionResult;
        this.inspectionStatus = inspectionStatus;
    }

}