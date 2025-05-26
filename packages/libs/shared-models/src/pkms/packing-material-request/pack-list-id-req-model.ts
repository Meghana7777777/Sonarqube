import { CommonRequestAttrs } from "../../common";

export class PackJobsByPackListIdsRequest extends CommonRequestAttrs {
    packListId: number;
    constructor(packListId: number, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId)
        this.packListId = packListId
    }
}