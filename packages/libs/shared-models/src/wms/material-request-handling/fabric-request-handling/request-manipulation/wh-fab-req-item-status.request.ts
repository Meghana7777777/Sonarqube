import { CommonRequestAttrs } from "../../../../common";
import { WhMatReqLineItemStatusEnum, WhMatReqLineStatusEnum } from "../../enum";

export class WhFabReqItemStatusRequest extends CommonRequestAttrs {
    materialRequestNo: string;
    itemIds: string[]; // usually the roll ids
    status: WhMatReqLineItemStatusEnum;

    constructor( username: string,unitCode: string,companyCode: string, userId: number, materialRequestNo: string, status: WhMatReqLineItemStatusEnum) {
        super(username, unitCode, companyCode, userId);
        this.materialRequestNo = materialRequestNo;
        this.status = status;
    }
}
