import { CommonRequestAttrs } from "../../common";

export class SPS_C_JobNumbersForReconciliationRequest extends CommonRequestAttrs {
    jobNumbers: string[];

    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNumbers: string[]) {
        super(username, unitCode, companyCode, userId);
        this.jobNumbers = jobNumbers;
    }
}

// {
//     "jobNumbers": ["PJ-LINK5-2-1", "PJ-LINK6-2-2"],
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA"
// }