import { CommonRequestAttrs } from "../../../common";

export class PackingJobIdRequest extends CommonRequestAttrs {
    packJobId: number;
    constructor(
        packJobId: number,
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.packJobId = packJobId;
    }
}