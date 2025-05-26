import { CommonRequestAttrs, ProcessTypeEnum } from "@xpparel/shared-models"


// barcode	date_time	proc_type	proc_serial	quality_type	quality_reason	quantity	inspector_name	location_code	barcode_level


export enum BarcodeLevelEnum {
    JOB = 'J',
    BUNDLE = 'B'
}

export class PTS_C_QmsInspectionLogRequest extends CommonRequestAttrs {
    barcode: string;
    dateTime: string;
    qualityType: string;
    reasonQtys: PTS_C_QmsCheckQtysModel[];
    qualityReason: string;
    inspectorName: string;
    locationCode: string;
    barcodeLevel: BarcodeLevelEnum
    opCode:string;
    processType:ProcessTypeEnum
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string, dateTime: string, qualityType: string, reasonQtys: PTS_C_QmsCheckQtysModel[], qualityReason: string, inspectorName: string, locationCode: string, barcodeLevel: BarcodeLevelEnum,opCode:string,processType:ProcessTypeEnum) {
        
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.dateTime = dateTime;
        this.qualityType = qualityType;
        this.reasonQtys = reasonQtys;
        this.qualityReason = qualityReason;
        this.inspectorName = inspectorName;
        this.locationCode = locationCode;
        this.barcodeLevel = barcodeLevel;
        this.opCode=opCode;
        this.processType=processType;

    }
}

export class PTS_C_QmsCheckQtysModel {
    quantity: number;
    reason: string;
}





