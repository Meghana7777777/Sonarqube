import { InsInspectionFinalInSpectionStatusEnum, InsTrimNamesEnum, InsTrimTypesEnum } from "../../enum";
import { InsCommonInspRollInfo } from "../common-insp-roll-info";
import { InsFourPointsInspectionRollDetails, ThreadInsInspectionConeDetails, TrimInsInspectionConeDetails, YarnInsInspectionConeDetails } from "./four-points-inspection-details.model";

export class YarnInsBasicInspectionRollDetails extends InsCommonInspRollInfo {
    fourPointInspection: YarnInsInspectionConeDetails[];
    // rollAcceptance: boolean;
    // reason: string;
    // approvedWithRemarks: string;
    // acceptanceQty: number;
    remarks: string;
    // inspectionStatus: InspectionStatusEnum;
    measuredRollWidth: number; // IN CM
    calculatedPointResult?: number; // a run time reference variable. not stored in the backend
    measuredRollLength: number; // IN YARD
    netWeight: number;
    grossWeight: number;
    twistPerInch:number;
    elongation:number;
    tensileStrength:number;
    moistureContent:number;
    yarnCount:number;
   

    constructor(rollId: number, externalRollNo: number, barcode: string, qryCode: string, lotNumber: string, rollQty: number, rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum, fourPointInspection: YarnInsInspectionConeDetails[], remarks: string, measuredRollWidth: number, measuredRollLength: number, sShade: string, netWeight: number, grossWeight: number,twistPerInch:number,tensileStrength:number, moistureContent:number, yarnCount:number,) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, sShade);
        this.fourPointInspection = fourPointInspection;
        // this.rollAcceptance = rollAcceptance;
        // this.acceptanceQty = acceptanceQty;
        this.remarks = remarks;
        this.rollQty = rollQty;
        this.measuredRollWidth = measuredRollWidth;
        this.measuredRollLength = measuredRollLength;
        this.rollQty = rollQty;
        this.netWeight = netWeight;
        this.grossWeight= grossWeight;
        this.twistPerInch=twistPerInch;
        this.tensileStrength=tensileStrength;
        this.moistureContent=moistureContent;
        this.yarnCount=yarnCount;
       

    }

} 

export class ThreadInsBasicInspectionRollDetails extends InsCommonInspRollInfo {
    fourPointInspection: ThreadInsInspectionConeDetails[];
    // rollAcceptance: boolean;
    // reason: string;
    // approvedWithRemarks: string;
    // acceptanceQty: number;
    remarks: string;
    // inspectionStatus: InspectionStatusEnum;
    measuredRollWidth: number; // IN CM
    calculatedPointResult?: number; // a run time reference variable. not stored in the backend
    measuredRollLength: number; // IN YARD
    netWeight: number;
    grossWeight: number;
    twistPerInch:number;
    elongation:number;
    tensileStrength:number;
    moistureContent:number;
    yarnCount:number;
   

    constructor(rollId: number, externalRollNo: number, barcode: string, qryCode: string, lotNumber: string, rollQty: number, rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum, fourPointInspection: YarnInsInspectionConeDetails[], remarks: string, measuredRollWidth: number, measuredRollLength: number, sShade: string, netWeight: number, grossWeight: number,twistPerInch:number,tensileStrength:number, moistureContent:number, yarnCount:number,) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, sShade);
        this.fourPointInspection = fourPointInspection;
        // this.rollAcceptance = rollAcceptance;
        // this.acceptanceQty = acceptanceQty;
        this.remarks = remarks;
        this.rollQty = rollQty;
        this.measuredRollWidth = measuredRollWidth;
        this.measuredRollLength = measuredRollLength;
        this.rollQty = rollQty;
        this.netWeight = netWeight;
        this.grossWeight= grossWeight;
        this.twistPerInch=twistPerInch;
        this.tensileStrength=tensileStrength;
        this.moistureContent=moistureContent;
        this.yarnCount=yarnCount;
       

    }

}





export class InsBasicInspectionRollDetails extends InsCommonInspRollInfo {
    fourPointInspection: InsFourPointsInspectionRollDetails[];
    // rollAcceptance: boolean;
    // reason: string;
    // approvedWithRemarks: string;
    // acceptanceQty: number;
    remarks: string;
    // inspectionStatus: InspectionStatusEnum;
    measuredRollWidth: number; // IN CM
    calculatedPointResult?: number; // a run time reference variable. not stored in the backend
    measuredRollLength: number; // IN YARD 


    constructor(rollId: number, externalRollNo: number, barcode: string, qryCode: string, lotNumber: string, rollQty: number, rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum, fourPointInspection: InsFourPointsInspectionRollDetails[], remarks: string, measuredRollWidth: number, measuredRollLength: number, sShade: string) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, sShade);
        this.fourPointInspection = fourPointInspection;
        // this.rollAcceptance = rollAcceptance;
        // this.acceptanceQty = acceptanceQty;
        this.remarks = remarks;
        this.rollQty = rollQty;
        this.measuredRollWidth = measuredRollWidth;
        this.measuredRollLength = measuredRollLength;
        this.rollQty = rollQty
    }

} 

export class TrimInsBasicInspectionRollDetails extends InsCommonInspRollInfo {
    
    fourPointInspection: TrimInsInspectionConeDetails[];
    trimName: InsTrimNamesEnum;
    trimType: InsTrimTypesEnum;
    qualityPassed: number;
    qualityFailed: number;
    trimFinalInsResult: InsInspectionFinalInSpectionStatusEnum;
    functionalChecks: InsInspectionFinalInSpectionStatusEnum;
    visualChecks: InsInspectionFinalInSpectionStatusEnum;
    colorChecks: InsInspectionFinalInSpectionStatusEnum;
    strengthChecks: InsInspectionFinalInSpectionStatusEnum;
    remarks: string;

    constructor(
        fourPointInspection: TrimInsInspectionConeDetails[],
        trimName: InsTrimNamesEnum,
        trimType: InsTrimTypesEnum,
        qualityPassed: number,
        qualityFailed: number,
        trimFinalInsResult: InsInspectionFinalInSpectionStatusEnum,
        functionalChecks: InsInspectionFinalInSpectionStatusEnum,
        visualChecks: InsInspectionFinalInSpectionStatusEnum,
        colorChecks: InsInspectionFinalInSpectionStatusEnum,
        strengthChecks: InsInspectionFinalInSpectionStatusEnum,
        remarks: string,
        rollId: number, externalRollNo: number, barcode: string, qryCode: string, lotNumber: string, rollQty: number, rollWidth: number, rollInsResult: InsInspectionFinalInSpectionStatusEnum, rollFinalInsResult: InsInspectionFinalInSpectionStatusEnum,sShade:string,
    ) {
        super(rollId, externalRollNo, barcode, qryCode, lotNumber, rollQty, rollWidth, rollInsResult, rollFinalInsResult, null, sShade);
        this.fourPointInspection = fourPointInspection;
        this.trimName = trimName;
        this.trimType = trimType;
        this.qualityPassed = qualityPassed;
        this.qualityFailed = qualityFailed;
        this.trimFinalInsResult = trimFinalInsResult;
        this.functionalChecks = functionalChecks;
        this.visualChecks = visualChecks;
        this.colorChecks = colorChecks;
        this.strengthChecks = strengthChecks;
        this.remarks = remarks;
    }
}
