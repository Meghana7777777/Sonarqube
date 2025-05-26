import { GlobalResponseObject } from "../../../common";
import { DocketLayModel } from "./docket-lay.model";

export class DocketLaysResponse extends GlobalResponseObject {
    data ?: DocketLayModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketLayModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}