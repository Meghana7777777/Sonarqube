import { CommonRequestAttrs } from "../common";

export class ForecastYearMonthRequest extends CommonRequestAttrs {
    year: string;
    month: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, year: string, month: string) {
        super(username, unitCode, companyCode, userId);
        this.year = year,
            this.month = month
    }
}

export class ForecastQtyUpdateRequest extends CommonRequestAttrs {
    planDate: Date;
    forecastQty: number;
    module: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, planDate: Date, forecastQty: number) {
        super(username, unitCode, companyCode, userId);
        this.planDate = planDate,
        this.forecastQty = forecastQty
    }
}

export class ForecastYearRequest extends CommonRequestAttrs {
    year: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, year: number) {
        super(username, unitCode, companyCode, userId);
        this.year = year
    }
}

export class ForecastYearDataRequest extends CommonRequestAttrs {
    year: number;
    month: number;
    planDate?: Date;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, year: number, month: number, planDate?: Date) {
        super(username, unitCode, companyCode, userId);
        this.year = year,
        this.month = month,
        this.planDate = planDate
    }
}