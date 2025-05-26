import { GlobalResponseObject } from "../../../common";
import { SewingJobPreviewHeaderInfo } from "./sewing-job-preview.model";

export class SewingJobPreviewModelResp extends GlobalResponseObject {
    data: SewingJobPreviewHeaderInfo;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobPreviewHeaderInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}