import { GlobalResponseObject } from "../../common";
import { FgWhReportResponseDto } from "./fg-wh-report-response-dto";

export class FgWhReportResponseModel extends GlobalResponseObject {
    data: FgWhReportResponseDto[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgWhReportResponseDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}