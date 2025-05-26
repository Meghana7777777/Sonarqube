export class PlannedDocketReportModel {
    remark: string;
    requestNumber: string;
    resourceDesc: string;
    plannedDateTime: string;
    materialRequestOn: string;
    matFullfillDateTime: string;
    docketGroup: string;

    constructor(
        remark: string,
        requestNumber: string,
        resourceDesc: string,
        plannedDateTime: string,
        materialRequestOn: string,
        matFullfillDateTime: string,
        docketGroup: string
    ) {
        this.remark = remark;
        this.requestNumber = requestNumber;
        this.resourceDesc = resourceDesc;
        this.plannedDateTime = plannedDateTime;
        this.materialRequestOn = materialRequestOn;
        this.matFullfillDateTime = matFullfillDateTime;
        this.docketGroup = docketGroup;
    }
}
