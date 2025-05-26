import { CommonRequestAttrs, TrimStatusEnum } from "@xpparel/shared-models";

export class JobRmStatusModel extends CommonRequestAttrs {
    jobNumber: string;
    rmStatus: TrimStatusEnum;

    /**
     * Constructor for JobRmStatusModel
     * @param username - The username of the requester
     * @param unitCode - The unit code
     * @param companyCode - The company code
     * @param userId - The ID of the user
     * @param date - (Optional) The request date
     * @param jobNumber - The job number
     * @param rmStatus - The raw material status
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        rmStatus: TrimStatusEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.rmStatus = rmStatus;
    }
}
