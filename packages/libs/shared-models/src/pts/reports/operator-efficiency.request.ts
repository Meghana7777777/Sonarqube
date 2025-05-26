import { CommonRequestAttrs } from "../../common";

export class OperatorEfficiencyRequest extends CommonRequestAttrs {
    fromDate: Date;
    toDate: Date;
    constructor (
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        fromDate: Date,
        toDate: Date
    ) {
        super(username, unitCode, companyCode, userId);
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}


// {
//     "fromDate": "2025-02-16",
//     "toDate": "2025-02-16",
//     "companyCode": "5000",
//     "unitCode": "B3",
//     "username": "rajesh"
// }