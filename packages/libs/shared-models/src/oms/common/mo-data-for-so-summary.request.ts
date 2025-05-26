import { CommonRequestAttrs } from "../../common";

export class SoSummaryRequest extends CommonRequestAttrs {
    soNumber: string;
    // styleCode?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        soNumber: string,
        // styleCode?: string,
    ) {
        super(username, unitCode, companyCode, userId);
        // this.styleCode = styleCode;
        this.soNumber = soNumber;
    }
}