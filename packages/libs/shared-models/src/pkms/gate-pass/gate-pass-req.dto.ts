import { CommonRequestAttrs } from "../../common";

export class GatePassReqDto extends CommonRequestAttrs {
    gatePassId: number
    constructor(username: string, unitCode: string, companyCode: string, userId: number, gatePassId: number) {
        super(username, unitCode, companyCode, userId)
        this.gatePassId = gatePassId
    }
}