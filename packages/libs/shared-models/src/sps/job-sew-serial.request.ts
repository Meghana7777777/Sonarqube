import { CommonRequestAttrs } from "../common";

export class JobSewSerialReq extends CommonRequestAttrs {
    jobNumber: string; // Job number for the sewing job
    sewSerial: number; // Sewing serial number
    isBundleWiseInfoNeed: boolean

    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        jobNumber: string,
        sewSerial: number,
        isBundleWiseInfoNeed: boolean
    ) {
        super(username, unitCode, companyCode, userId); // Initialize parent class attributes
        this.jobNumber = jobNumber; // Initialize job number
        this.sewSerial = sewSerial; // Initialize sewing serial
        this.isBundleWiseInfoNeed = isBundleWiseInfoNeed;
    }
}
