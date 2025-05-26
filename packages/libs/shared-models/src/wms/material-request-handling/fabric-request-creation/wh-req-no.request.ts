import { CommonRequestAttrs } from "../../../common";

// The external warehouse request no request
export class WhReqNoRequest extends CommonRequestAttrs {
    reqNo: string; // the unique req no of the wh req header entity
    reqId: number; // PK of the ext wh req header entity

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reqNo: string,
        reqId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.reqNo = reqNo;
        this.reqId = reqId;
    }
}
