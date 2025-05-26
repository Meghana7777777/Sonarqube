import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ProcessTypeEnum } from "../../oms/enum/process-type-enum";



// {
//     "jobNumber": "PJ-EMB1-17-1",
//     "procSerial": 1,
//     "procType": "EMB",
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA"
// }


export class PTS_C_ProductionJobNumberRequest extends CommonRequestAttrs {
    jobNumber: string;
    procSerial: number;
    procType: ProcessTypeEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        procSerial: number,
        procType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.procSerial = procSerial;
        this.procType = procType;
    }
}


export class JobNumberRequest extends CommonRequestAttrs {
    jobNumber: string;
    procSerial: number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        procSerial: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.procSerial = procSerial;
    }
}




