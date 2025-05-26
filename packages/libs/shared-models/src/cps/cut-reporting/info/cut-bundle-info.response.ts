
import { GlobalResponseObject } from "../../../common";
import { CutBundleInfoModel } from "./cut-bundle-info.model";

export class CutBundleInfoResponse extends GlobalResponseObject {
    data ?: CutBundleInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutBundleInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}