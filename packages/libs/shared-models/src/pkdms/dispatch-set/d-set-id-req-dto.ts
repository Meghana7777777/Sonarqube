import { CommonIdReqModal, CommonRequestAttrs } from "../../common";

export class DSetReqIdDto extends CommonRequestAttrs {
    dSetId: number;
    whReqId: string;// whHeaderReqId
    constructor(username: string, unitCode: string, companyCode: string, userId: number, dSetId: number, whReqId: string) {
        super(username, unitCode, companyCode, userId);
        this.dSetId = dSetId;
        this.whReqId = whReqId;
    }
}