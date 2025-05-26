import { GlobalResponseObject } from "../../../../common";
import { DocketLayingTimeModel } from "./docket-laying-time.model";


export class DocketLayingTimesResponse extends GlobalResponseObject {
    data ?: DocketLayingTimeModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketLayingTimeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}