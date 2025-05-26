import { GlobalResponseObject } from "../../../common";
import { TotalLayedMeterageModel } from "./total-layed-meterage.model";

export class TotalLayedMeterageResponse extends GlobalResponseObject {
    data : TotalLayedMeterageModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: TotalLayedMeterageModel) {
        super(status, errorCode, internalMessage);
        this.data = data;

    }

}













