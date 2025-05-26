import { GlobalResponseObject } from "../../common";
import { GrnDetailsReportModel } from "./grn-details-reports.model";

export class GrnDetailsReportResponse extends GlobalResponseObject{
    data : GrnDetailsReportModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: GrnDetailsReportModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 