import { CommonRequestAttrs } from "../../common";
import { QMS_QualityCheckStatus } from "../enum";


export class QualityCheckCreationRequest extends CommonRequestAttrs {
    barcode: string;
    qualityTypeId: number;
    reportedBy: number;
    reportedOn: string; //date stirng
    qualityStatus: QMS_QualityCheckStatus
    qualityConfigId: number;
    reasonQtys : QMS_ReasonQtysModel[]


    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        qualityTypeId: number,
        reportedBy: number,
        reportedOn: string, //date stirng
        qualityStatus: QMS_QualityCheckStatus,
        qualityConfigId: number,
        reasonQtys?: QMS_ReasonQtysModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.qualityTypeId = qualityTypeId;
        this.reportedBy = reportedBy;
        this.reportedOn = reportedOn;
        this.qualityStatus = qualityStatus;
        this.qualityConfigId = qualityConfigId;
        this.reasonQtys = reasonQtys
    }

}

export class QMS_ReasonQtysModel {
    quantity: number;
    reason: string;
}