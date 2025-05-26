
import { InsInspectionFinalInSpectionStatusEnum, InsInspectionResultEnum } from "../../enum";
import { InsCommonInspRollInfo } from "../common-insp-roll-info";

export class InsLabInspectionRollDetails extends InsCommonInspRollInfo {
    sGsm: number;
    gsm: number;
    toleranceFrom: number;
    toleranceTo: number;
    adjustment: string; // plus or minus
    adjustmentValue: number;
    inspectionResult: InsInspectionResultEnum;
    remarks: string;

    constructor(rollId: number,
        externalRollNo: number,
        barcode: string,
        qryCode: string,
        lotNumber: string,
        rollQty: number,
        rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum,
        sGsm: number
        , gsm: number
        , toleranceFrom: number
        , toleranceTo: number
        , adjustment: string,// plus or minus
        adjustmentValue: number
        , inspectionResult: InsInspectionResultEnum,
        remarks: string,sShade : string
    ) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, sShade);
        this.sGsm = sGsm;
        this.gsm = gsm;
        this.toleranceFrom = toleranceFrom;
        this.toleranceTo = toleranceTo;
        this.adjustment = adjustment
        this.adjustmentValue = adjustmentValue;
        this.inspectionResult = inspectionResult;
        this.rollQty = rollQty;
        this.remarks = remarks;
    }
}