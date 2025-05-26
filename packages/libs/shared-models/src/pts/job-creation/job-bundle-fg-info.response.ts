
import { GlobalResponseObject } from "@xpparel/shared-models";
import { JobBundleFgInfoModel } from "./job-bundle-fg-info.model";

export class JobBundleFgInfoResponse extends GlobalResponseObject {
    data?: JobBundleFgInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: JobBundleFgInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}