import { PkmsFgWhCurrStageEnum, PkmsFgWhReqApprovalEnum } from "../enum";

export class PKMSFgWhReqNoResponseDto {
    fgWhReqIds: number;
    fgWhReqNo: string;
    packListIds: number[];
    toWhCode: string;
    currentStage?: PkmsFgWhCurrStageEnum;
    requestApprovalStatus?: PkmsFgWhReqApprovalEnum;
    floor: number;
    requestDate: string;
    constructor(
        fgWhReqIds: number,
        fgWhReqNo: string,
        packListIds: number[],
        toWhCode: string,
        currentStage?: PkmsFgWhCurrStageEnum,
        requestApprovalStatus?: PkmsFgWhReqApprovalEnum,
        floor?: number,
        requestDate?: string
    ) {
        this.fgWhReqIds = fgWhReqIds;
        this.fgWhReqNo = fgWhReqNo;
        this.packListIds = packListIds;
        this.toWhCode = toWhCode;
        this.currentStage = currentStage;
        this.requestApprovalStatus = requestApprovalStatus;
        this.floor = floor;
        this.requestDate = requestDate;
    }
}