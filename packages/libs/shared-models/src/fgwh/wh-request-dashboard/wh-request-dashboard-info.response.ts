import { GlobalResponseObject } from "../../common";
import { WhRequestDashboardInfoModel } from "./wh-request-dashboard-info.model";

export class WhRequestDashboardInfoResp extends GlobalResponseObject{
    data : WhRequestDashboardInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: WhRequestDashboardInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   