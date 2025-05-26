import { CommonRequestAttrs } from "../../common";

export class PKMSPackListIdReqDto extends CommonRequestAttrs {
    packListId: number
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number, packListId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.packListId = packListId;
    }
}