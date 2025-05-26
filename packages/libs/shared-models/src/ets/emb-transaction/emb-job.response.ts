import { GlobalResponseObject } from "../../common";
import { EmbJobModel } from "./emb-job.model";

export class EmbJobResponse extends GlobalResponseObject {
    data ?: EmbJobModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: EmbJobModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}