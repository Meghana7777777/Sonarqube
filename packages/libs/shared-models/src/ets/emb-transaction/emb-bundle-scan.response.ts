import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { EmbBundleScanModel } from "./emb-bundle-scan.model";

export class EmbBundleScanResponse extends GlobalResponseObject {
    data ?: EmbBundleScanModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: EmbBundleScanModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}