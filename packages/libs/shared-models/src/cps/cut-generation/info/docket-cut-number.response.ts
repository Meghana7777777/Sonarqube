import { GlobalResponseObject } from "../../../common";
import { DocketCutNumberModel } from "./docket-cut-number.model";

export class DocketCutNumberResponse extends GlobalResponseObject {
    data ?: DocketCutNumberModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketCutNumberModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
