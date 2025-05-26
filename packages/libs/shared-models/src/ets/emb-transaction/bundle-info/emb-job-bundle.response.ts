import { GlobalResponseObject } from "../../../common";
import { EmbJobBundleModel } from "./emb-job-bundle.model";

// This response is utilized when we try to get the bundle info while doing the bundle scanning with user entered values
export class EmbJobBundleResponse extends GlobalResponseObject {
    data ?: EmbJobBundleModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: EmbJobBundleModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

