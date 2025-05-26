import { CommonRequestAttrs } from "../../common";
import { PkmsFgWhReqApprovalEnum } from "../../pkms";

export class FgWhStatusReq extends CommonRequestAttrs {
    requestApprovalStatus: PkmsFgWhReqApprovalEnum;
    requestId : number;
     constructor(username: string, unitCode: string, companyCode: string, userId: number,requestApprovalStatus :PkmsFgWhReqApprovalEnum,requestId :number) {
            super(username, unitCode, companyCode, userId)
            this.requestApprovalStatus = requestApprovalStatus;
            this.requestId = requestId;
        }
}