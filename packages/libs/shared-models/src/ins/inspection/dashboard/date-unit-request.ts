import { CommonRequestAttrs } from "../../../common";

export class InsDateUnitRequest extends CommonRequestAttrs {
    fromDate: string;  // Start date for the request period
    toDate: string;    // End date for the request period

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        fromDate: string,
        toDate: string
    ) {
        super(username, unitCode, companyCode, userId);  // Initialize inherited properties
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}