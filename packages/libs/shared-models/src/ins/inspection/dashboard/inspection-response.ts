import { GlobalResponseObject } from "../../../common";
import { InsKpiCardForInspectionModel } from "./kpi-cards-For-Inspection.model";

export class InsInspectionInfoResponse extends GlobalResponseObject {
    data : InsKpiCardForInspectionModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: InsKpiCardForInspectionModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
