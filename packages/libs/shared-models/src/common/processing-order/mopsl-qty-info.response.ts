import { GlobalResponseObject } from "../global-response-object";
import { MoPslQtyInfoModel } from "./mopsl-qty-info.model";

export class MoPslQtyInfoResponse extends GlobalResponseObject {
    data?: MoPslQtyInfoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoPslQtyInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}