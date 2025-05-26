import { GlobalResponseObject } from "../../../common";
import { LayReportingCuttingModel } from "./lay-reporting-cutting.model";

export class LayReportingCuttingResponse extends GlobalResponseObject {
    data ?: LayReportingCuttingModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: LayReportingCuttingModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}