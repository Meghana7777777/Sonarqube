import { CommonRequestAttrs } from "../../../common";

export class PackTableIdRequest extends CommonRequestAttrs {
    packTableId: number;
    jobNumber: string; // PK of the pack-table entity

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packTableId: number,
        jobNumber: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.packTableId = packTableId;
        this.jobNumber = jobNumber;
    }
}

