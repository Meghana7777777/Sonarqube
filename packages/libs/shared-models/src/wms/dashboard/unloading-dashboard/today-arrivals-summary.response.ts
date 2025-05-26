import { GlobalResponseObject } from "../../../common";
import { TodayArrivalsSummaryModel } from "./today-arrivals-summary.model";

export class TodayArrivalSummaryResponse extends GlobalResponseObject{
    data : TodayArrivalsSummaryModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TodayArrivalsSummaryModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   