
import { InsInspectionFinalInSpectionStatusEnum, InsInspectionStatusEnum } from "../../enum";
import { InsCommonInspRollInfo } from "../common-insp-roll-info";
import { InsWidthAtMeterModel } from "./width-at-meter.model";

export class InsRelaxationInspectionRollDetails extends InsCommonInspRollInfo {
    noOfJoins: number;
    sWidth: number;
    sLength: number;
    aWidth: number;
    aLength: number;
    startWidth: number;
    midWidth: number;
    endWidth: number;
    widthAtPoints: InsWidthAtMeterModel[];
    remarks: string;
    inspectionStatus: InsInspectionStatusEnum;

    constructor(rollId: number,
        externalRollNo: number,
        barcode: string,
        qryCode: string,
        lotNumber: string,
        rollQty: number,
        rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum,
        noOfJoins: number,
        sWidth: number,
        sLength: number,
        aWidth: number,
        aLength: number,
        widthAtPoints: InsWidthAtMeterModel[], remarks: string,
        inspectionStatus: InsInspectionStatusEnum, startWidth: number,
        midWidth: number,
        endWidth: number) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, null);
        this.sWidth = sWidth;
        this.sLength = sLength;
        this.noOfJoins = noOfJoins;
        this.aWidth = aWidth;
        this.aLength = aLength;
        this.widthAtPoints = widthAtPoints;
        this.rollQty = rollQty;
        this.remarks = remarks;
        this.inspectionStatus = inspectionStatus;
        this.startWidth = startWidth;
        this.midWidth = midWidth;
        this.endWidth = endWidth;
    }
}
