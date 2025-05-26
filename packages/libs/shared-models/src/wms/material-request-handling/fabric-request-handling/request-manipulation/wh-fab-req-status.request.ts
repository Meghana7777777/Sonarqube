import { CommonRequestAttrs } from "../../../../common";
import { WhMatReqLineItemStatusEnum, WhMatReqLineStatusEnum } from "../../enum";

export class WhFabReqStatusRequest extends CommonRequestAttrs {
    materialRequestNo: string;
    status: WhMatReqLineStatusEnum;

    constructor( username: string,unitCode: string,companyCode: string, userId: number, materialRequestNo: string, status: WhMatReqLineStatusEnum) {
        super(username, unitCode, companyCode, userId);
        this.materialRequestNo = materialRequestNo;
        this.status = status;
    }
}
