import { CommonRequestAttrs } from "../../common";
import { PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum } from "../enum";

export class UpdateFgWhOurReqDto extends CommonRequestAttrs {
    toWhCode: string;
    floor: number;
    requestDate: string;
    whOutReqId: number;
    currentStage: PkmsFgWhCurrStageEnum;
    requestApprovalStatus: PkmsFgWhReqApprovalEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        toWhCode: string,
        floor: number,
        requestDate: string,
        whOutReqId: number,
        currentStage: PkmsFgWhCurrStageEnum,
        requestApprovalStatus: PkmsFgWhReqApprovalEnum,
    ) {
        super(username, unitCode, companyCode, userId);
        this.toWhCode = toWhCode;
        this.floor = floor;
        this.requestDate = requestDate;
        this.whOutReqId = whOutReqId;
        this.currentStage = currentStage;
        this.requestApprovalStatus = requestApprovalStatus;
    }
}