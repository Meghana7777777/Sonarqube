import { CommonRequestAttrs } from "../../common";

export class DateRangeRequestForPlannedDocket extends CommonRequestAttrs {
    startDate: string;
    endDate: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, startDate: string, endDate: string) {
        super(username, unitCode, companyCode, userId)
        this.startDate = startDate;
        this.endDate = endDate;
    }
}