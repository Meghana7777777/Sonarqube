import { GlobalResponseObject } from "../../../common";
import { PLGenQtyInfoModel } from "./pl-gen-qty-model";

export class PLGenQtyInfoResponse extends GlobalResponseObject {
    data ?: PLGenQtyInfoModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PLGenQtyInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
