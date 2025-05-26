import { GlobalResponseObject } from "../../../common";
import { EmbOpRepQtyModel } from "../emb-op-rep-qty.model";
import { JobScanQtyBasicModel } from "./job-scan-qty-basic.model";

export class JobScanQtyBasicResponse extends GlobalResponseObject {
    data ?: JobScanQtyBasicModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: JobScanQtyBasicModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}