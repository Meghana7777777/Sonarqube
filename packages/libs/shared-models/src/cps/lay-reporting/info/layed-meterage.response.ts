import { GlobalResponseObject } from "../../../common";
import { LayReportingCuttingModel } from "./lay-reporting-cutting.model";
import { LayedMeterageModel, TodayLayedCutAndMeterage } from "./layed-meterage.model";

export class LayMeterageResponse extends GlobalResponseObject {
    data : LayedMeterageModel[]
    constructor(status: boolean, errorCode: number, internalMessage: string, data: LayedMeterageModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }
}

export class TodayLayAndCutResponse extends GlobalResponseObject {
    data : TodayLayedCutAndMeterage

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TodayLayedCutAndMeterage) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}