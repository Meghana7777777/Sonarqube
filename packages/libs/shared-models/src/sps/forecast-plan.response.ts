import { GlobalResponseObject } from "../common";
import { ForecastPlanModel } from "./fr-plan-upload.model";


export class ForecastPlanResponse extends GlobalResponseObject {
    data: ForecastPlanModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ForecastPlanModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}