import { CommonRequestAttrs } from "../../../common";
import { MrnStatusEnum } from "../../enum";

export class MrnIdStatusRequest extends CommonRequestAttrs {

    mrnId: number; // the pk of the mrn entity
    mrnReqNo: string;  // not required at the moment
    mrnStatus: MrnStatusEnum;
    remarks: string; // not required when retrieval

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        mrnId: number, // the pk of the mrn entity
        mrnReqNo: string,  
        mrnStatus: MrnStatusEnum,
        remarks: string, // not required when retrieval
    ) {
        super(username, unitCode, companyCode, userId);
        this.mrnId = mrnId;
        this.mrnReqNo = mrnReqNo;
        this.mrnStatus = mrnStatus;
        this.remarks = remarks;
    }
}