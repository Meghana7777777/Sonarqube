import { CommonRequestAttrs } from "../../common";
import { PkmsFgWhReqTypeEnum } from "../enum";

export class PKMSFgWhereHouseCreateDto extends CommonRequestAttrs {
    packListIds: number[];
    toWhCode: string;
    floor: string;
    requestedDate: string;
    reqType: PkmsFgWhReqTypeEnum;
    plCartonIds?: FgWhReqSelectedCartons[];
    dispatchReqId?: number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packListIds: number[],
        toWhCode: string,
        floor: string,
        requestedDate: string,
        reqType: PkmsFgWhReqTypeEnum,
        plCartonIds?: FgWhReqSelectedCartons[],
        dispatchReqId?: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.packListIds = packListIds;
        this.toWhCode = toWhCode;
        this.floor = floor;
        this.requestedDate = requestedDate;
        this.reqType = reqType;
        this.plCartonIds = plCartonIds;
        this.dispatchReqId= dispatchReqId;
    }
};



export class FgWhReqSelectedCartons {
    packListId: number;
    cartonIds: number[];
    constructor(
        packListId: number,
        cartonIds: number[],
    ) {
        this.packListId = packListId;
        this.cartonIds = cartonIds;
    }
}