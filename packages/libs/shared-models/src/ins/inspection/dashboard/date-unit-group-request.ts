import { CommonRequestAttrs } from "../../../common";

export class InsDateGroupUnitRequest extends CommonRequestAttrs {
    fromDate: string;  // Start date for the request period
    toDate: string;    // End date for the request period
    group : string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        fromDate: string,
        toDate: string,
        group : string
    ) {
        super(username, unitCode, companyCode, userId);  // Initialize inherited properties
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.group  = group;
    }
}