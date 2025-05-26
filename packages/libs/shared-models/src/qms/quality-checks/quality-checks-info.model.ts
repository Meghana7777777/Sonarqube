import { ProcessTypeEnum } from "../../oms";
import { QMS_QualityCheckStatus } from "../enum";

export class QualityChecksInfoModel {
    styleCode: string;
    processType: ProcessTypeEnum;
    qualityType: string;
    isEsclated: boolean;
    barcode:string;
    jobNo:string;
    fgSku:string;
    reportedBy:string;
    reportedOn:string;
    reportedQuantity:number;
    reason:string;
    qualityStatus:QMS_QualityCheckStatus;


    /**
     * 
     * @param styleCode 
     * @param processType 
     * @param qualityType 
     * @param isEsclated 
     * @param barcode 
     * @param jobNo 
     * @param fgSku 
     * @param reportedBy 
     * @param reportedOn 
     * @param reportedQuantity 
     * @param reason 
     * @param qualityStatus 
     */

    constructor(styleCode: string, processType: ProcessTypeEnum, qualityType: string, isEsclated: boolean,barcode:string,jobNo:string,fgSku:string,reportedBy:string,reportedOn:string,reportedQuantity:number,reason:string,qualityStatus:QMS_QualityCheckStatus){
        this.styleCode = styleCode;
        this.processType = processType;
        this.qualityType = qualityType;
        this.isEsclated = isEsclated;
        this.barcode = barcode;
        this.jobNo = jobNo;
        this.fgSku = fgSku;
        this.reportedBy = reportedBy;
        this.reportedOn = reportedOn;
        this.reportedQuantity = reportedQuantity;
        this.reason = reason;
        this.qualityStatus = qualityStatus;

    }
}