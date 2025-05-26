import { GlobalResponseObject } from "../../common";
import { SewingJobPreviewForActualGenFeatureGroup } from "./sewing-job-gen-for-actuals.models";

export class SewJobPreviewForFeatureGroupResp extends GlobalResponseObject {
    data: SewingJobPreviewForActualGenFeatureGroup;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewingJobPreviewForActualGenFeatureGroup) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}