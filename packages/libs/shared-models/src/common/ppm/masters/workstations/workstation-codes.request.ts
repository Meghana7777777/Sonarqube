import { CommonRequestAttrs } from "../../../common-request-attr.model";

export class WorkstationCodesRequest extends CommonRequestAttrs {
    workstationCodes: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        workstationCodes: string[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.workstationCodes = workstationCodes;
    }
}

