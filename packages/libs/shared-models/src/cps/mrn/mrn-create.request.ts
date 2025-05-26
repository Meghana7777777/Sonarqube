import { CommonRequestAttrs } from "../../common";
import { DocRollsRequest } from "../docket-material";

export class MrnCreateRequest extends CommonRequestAttrs {

    poSerial: number;
    docketNumber: string;
    docketGroup: string;
    remarks: string;
    rollsInfo: DocRollsRequest[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        docketNumber: string,
        docketGroup: string,
        remarks: string,
        rollsInfo: DocRollsRequest[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.docketNumber = docketNumber;
        this.docketGroup = docketGroup;
        this.remarks = remarks;
        this.rollsInfo = rollsInfo;
    }
}
