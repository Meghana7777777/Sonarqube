import { GlobalResponseObject } from "../../../common";
import { TotalEndBitsModel } from "./end-bits.model";

export class EndBitsResponse extends GlobalResponseObject {
    data : TotalEndBitsModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TotalEndBitsModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}