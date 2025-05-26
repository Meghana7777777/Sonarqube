import { GlobalResponseObject } from "../../../common";
import { PanelReqForJobModel } from "./panel-req-for-job-info.model";

export class PanelReqForJobInfoResp extends GlobalResponseObject {
    data: PanelReqForJobModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PanelReqForJobModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}