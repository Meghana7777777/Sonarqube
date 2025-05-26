import { CommonRequestAttrs } from "@xpparel/shared-models";

export class PkDSetItemIdsRequest extends CommonRequestAttrs {

    dSetItemPks: number[]; // The array of dms.d_set_item PK

    iNeedSubItemsAlso?: boolean;
    iNeedBagLevelBreakdownAlso?: boolean;
    iNeeContainerInfoAlso?: boolean;

    constructor(
        dSetItemPks: number[],

        iNeedSubItemsAlso?: boolean,
        iNeedBagLevelBreakdownAlso?: boolean,
        iNeeContainerInfoAlso?: boolean,
        username?: string,
        unitCode?: string,
        companyCode?: string,
        userId?: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.dSetItemPks == dSetItemPks
        this.iNeedSubItemsAlso = iNeedSubItemsAlso
        this.iNeedBagLevelBreakdownAlso = iNeedBagLevelBreakdownAlso
        this.iNeeContainerInfoAlso = iNeeContainerInfoAlso
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
    }
}


