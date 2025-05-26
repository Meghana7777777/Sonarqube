import { CommonRequestAttrs } from "../../../common";
import { WhReqByObjectEnum } from "../enum";

// The external warehouse request no request
export class WhExtReqNoRequest extends CommonRequestAttrs {
    extReqNo: string; // the unique req no of the ext req entity
    extReqRefId: number; // PK of the ext req entity i.e po-material-request in this case. Usually not sent
    reqEntity: WhReqByObjectEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        extReqNo: string,
        extReqRefId: number,
        reqEntity: WhReqByObjectEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.extReqNo = extReqNo;
        this.extReqRefId = extReqRefId;
        this.reqEntity = reqEntity;
    }
}
