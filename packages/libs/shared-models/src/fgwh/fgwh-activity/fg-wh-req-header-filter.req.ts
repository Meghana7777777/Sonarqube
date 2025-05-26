import { CommonRequestAttrs } from "../../common";
import { PkmsFgWhReqApprovalEnum, PkmsFgWhCurrStageEnum, PkmsFgWhReqTypeEnum } from "../../pkms";

export class FgWhReqHeaderFilterReq extends CommonRequestAttrs{
    reqType : PkmsFgWhReqTypeEnum
    currentStage :PkmsFgWhCurrStageEnum[];
    approvalStatus : PkmsFgWhReqApprovalEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, reqType : PkmsFgWhReqTypeEnum,currentStage :PkmsFgWhCurrStageEnum[],approvalStatus : PkmsFgWhReqApprovalEnum) {
        super(username, unitCode, companyCode, userId)
        this.reqType = reqType
        this.currentStage = currentStage
        this.approvalStatus = approvalStatus
    }
}