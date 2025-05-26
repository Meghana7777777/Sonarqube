import { CommonRequestAttrs } from "@xpparel/shared-models";

export class DSetSubItemIdsRequest extends CommonRequestAttrs {

    dSetSubItemPks: number[]; // The array of dms.d_set_sub_item PK

    constructor(
        dSetSubItemPks: number[],
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.dSetSubItemPks = dSetSubItemPks
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}


