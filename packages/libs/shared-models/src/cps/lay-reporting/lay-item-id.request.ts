import { CommonRequestAttrs } from "../../common";

export class LayItemIdRequest extends CommonRequestAttrs {
    layId: number; // the pk of the po_docket_lay
    itemIds: number[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        itemIds: number[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.itemIds = itemIds;
    }
}