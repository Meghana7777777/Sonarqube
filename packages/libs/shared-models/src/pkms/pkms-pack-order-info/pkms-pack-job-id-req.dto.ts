import { CommonRequestAttrs } from "../../common";

export class PKMSPackJobIdReqDto extends CommonRequestAttrs {
    packOrderId: number;
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,  packOrderId: number
    ) {
        super(username,
            unitCode,
            companyCode,
            userId);
            this.packOrderId = packOrderId;
    }
}