import { GlobalResponseObject } from "../common";
import { ForecastPlanYearDataModel, ForecastPlanYearModel, ForecastPlanYearMonthModel } from "./forecast-plan-year-month.model";


export class ForecastPlanYearMonthResponse extends GlobalResponseObject {
    data: ForecastPlanYearMonthModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ForecastPlanYearMonthModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class ForecastPlanYearDataResponse extends GlobalResponseObject {
    data: ForecastPlanYearDataModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ForecastPlanYearDataModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class ForecastPlanYearResponse extends GlobalResponseObject {
    data: ForecastPlanYearModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ForecastPlanYearModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}