import { CommonRequestAttrs } from "../../common";

export class JobOpUpdateRequest extends CommonRequestAttrs {

    opCode: string;
    jobNumber: string;
    gQty: number;
    rQty: number;

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        jobNumber: string, 
        opCode: string,
        gQty: number,
        rQty: number
    ) {
        super(username,unitCode,companyCode,userId);
        this.jobNumber = jobNumber;
        this.opCode = opCode;
        this.gQty = gQty;
        this.rQty = rQty;
    }
}
