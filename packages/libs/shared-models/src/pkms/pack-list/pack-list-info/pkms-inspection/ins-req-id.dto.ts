import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";

export class PKMSInsReqIdDto extends CommonRequestAttrs {
    insReqId: number;
    cartonNo?: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, insReqId: number, cartonNo?: string) {
        super(username, unitCode, companyCode, userId)
        this.insReqId = insReqId;
        this.cartonNo = cartonNo;
    }
}