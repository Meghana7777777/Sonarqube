import { GlobalResponseObject } from "../../../common";
import { GrnInfoForDashboard } from "./grn-info-for-dashboard.model";

export class GrnDetailsForDashboardResponse extends GlobalResponseObject{
    data : GrnInfoForDashboard;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: GrnInfoForDashboard) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   