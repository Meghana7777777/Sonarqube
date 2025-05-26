import { GlobalResponseObject } from "../../../common";
import { PoSummaryModel } from "./po-summary.model";

export class PoSummaryResponse extends GlobalResponseObject {
    data ?: PoSummaryModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PoSummaryModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}