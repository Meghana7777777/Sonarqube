

// Current heirarchy 
// SR -> SR ITEM -> DSETITEM -> DSETITEM Abstract

import { DSetItemsAbstractModel } from "./d-set-items-abstract.model";

// SRITEM
// This object holds info for 1 Shipping item (i.e DSET)
export class ShippingItemsAbstractModel {
    sRequestId: number;
    sRequestItemId: number;
    dSetId: number;
    dSetItemsAbstract: DSetItemsAbstractModel[];
    constructor(
        sRequestId: number,
        sRequestItemId: number,
        dSetId: number,
        dSetItemsAbstract: DSetItemsAbstractModel[],) {
        this.sRequestId = sRequestId
        this.sRequestItemId = sRequestItemId
        this.dSetId = dSetId
        this.dSetItemsAbstract = dSetItemsAbstract
    }
}







