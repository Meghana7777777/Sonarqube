import { CommonRequestAttrs } from "../../../common";

export class RejectedReasonsResponseDto extends CommonRequestAttrs {
    id: number
    reasonCode: string
    reasonName: string
    reasonDesc: string
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, reasonCode: string,
        reasonName: string,
        reasonDesc: string) {
        super(username, unitCode, companyCode, userId)
        this.id = id
        this.reasonCode = reasonCode
        this.reasonDesc = reasonDesc
        this.reasonName = reasonName
    }
}