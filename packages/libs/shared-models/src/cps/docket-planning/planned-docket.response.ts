import { GlobalResponseObject } from "../../common";
import { PlannedDocketReportModel } from "./planned-docket.model";

export class PlannedDocketReportResponse extends GlobalResponseObject {
    data?: PlannedDocketReportModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: PlannedDocketReportModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}