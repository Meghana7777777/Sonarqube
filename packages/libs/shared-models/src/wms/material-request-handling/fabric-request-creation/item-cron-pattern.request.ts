import { CommonRequestAttrs } from "../../../common";

export class ItemCodeCronPatternRequest extends CommonRequestAttrs {
    itemCode: string;
    jobId: string;
    delay: number;
    lockId: number; // PK OF MATERIAL LOCK 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        itemCode: string,
        jobId: string,
        delay: number,
        lockId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.itemCode = itemCode;
        this.jobId = jobId;
        this.delay = delay;
        this.lockId = lockId;
    }
}