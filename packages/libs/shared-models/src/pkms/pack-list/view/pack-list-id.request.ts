import { CommonRequestAttrs } from "../../../common";

export class PackingListIdRequest extends CommonRequestAttrs {
    packListId: number;
    constructor(
        packListId: number,
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.packListId = packListId;
    }
}