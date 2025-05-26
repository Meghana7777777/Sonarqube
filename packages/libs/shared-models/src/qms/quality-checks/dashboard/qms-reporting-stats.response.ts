import { GlobalResponseObject } from "../../../common";
import { QMS_ReporitngStatsInfoModel } from "./qms-reporting-stats.model";

export class QMS_ReportingStatsResponse extends GlobalResponseObject{
    data: QMS_ReporitngStatsInfoModel


    constructor(status: boolean, errorCode: number, internalMessage: string, data: QMS_ReporitngStatsInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}