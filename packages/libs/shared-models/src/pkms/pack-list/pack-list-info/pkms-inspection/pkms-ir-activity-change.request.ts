import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { InsInspectionActivityStatusEnum } from "packages/libs/shared-models/src/ins";
import { PackActivityStatusEnum } from "packages/libs/shared-models/src/pkms";

export class PKMSIrActivityChangeRequest extends CommonRequestAttrs {
    insReqId: number;
    insCurrentActivity: InsInspectionActivityStatusEnum;
    changeDateTime: string;
    remarks: string;

    constructor( username: string, unitCode: string, companyCode: string, userId: number, insReqId: number, changeDateTime: string, insCurrentActivity: InsInspectionActivityStatusEnum, remarks: string) {
        super(username, unitCode, companyCode, userId);
        this.insReqId = insReqId;
        this.insCurrentActivity = insCurrentActivity;
        this.remarks = remarks;
        this.changeDateTime = changeDateTime;
    }
}