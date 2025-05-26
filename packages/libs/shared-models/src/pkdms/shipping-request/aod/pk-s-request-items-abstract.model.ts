

// Current heirarchy 
// SR -> SR ITEM -> DSETITEM -> DSETITEM Abstract

import { PkDSetItemsAbstractModel } from "./pk-d-set-items-abstract.model";

// SRITEM
// This object holds info for 1 Shipping item (i.e DSET)
export class PkShippingItemsAbstractModel {
    sRequestId: number;
    sRequestItemId: number;
    dSetId: number;
    dSetReqNo: string;
    dSetItemsAbstract: PkDSetItemsAbstractModel[];
    gatePassRefNo: string;

    constructor(
        sRequestId: number,
        sRequestItemId: number,
        dSetId: number,
        dSetReqNo: string,
        gatePassRefNo: string,
        dSetItemsAbstract: PkDSetItemsAbstractModel[]
    ) {
        this.sRequestId = sRequestId;
        this.sRequestItemId = sRequestItemId;
        this.dSetId = dSetId;
        this.dSetReqNo = dSetReqNo;
        this.gatePassRefNo = gatePassRefNo;
        this.dSetItemsAbstract = dSetItemsAbstract;
    }
}







