// DSETTIEM

import { DSetSubItemAbstractModel } from "./d-set-sub-item-abstract-model";


// This abstract is for a Dset item 
export class DSetItemsAbstractModel {
    dSetId: number;
    dSetItemId: number;
    cutNumber: string;
    cutSubNumber: string;
    productName: string;
    dSetItems: DSetSubItemAbstractModel[]; // The cut bundles goruped by shade, color and size
    constructor(
        dSetId: number,
        dSetItemId: number,
        cutNumber: string,
        cutSubNumber: string,
        productName: string,
        dSetItems: DSetSubItemAbstractModel[]
    ) {
        this.dSetId = dSetId
        this.dSetItemId = dSetItemId
        this.cutNumber = cutNumber
        this.cutSubNumber = cutSubNumber
        this.productName = productName
        this.dSetItems = dSetItems
    }
}