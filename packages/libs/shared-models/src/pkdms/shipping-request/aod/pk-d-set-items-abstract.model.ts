// DSETTIEM

import { PkDSetSubItemAbstractModel } from "./pk-d-set-sub-item-abstract-model";


// This abstract is for a Dset item 
export class PkDSetItemsAbstractModel {
    dSetId: number;
    dSetItemId: number;
    moNo: string;
    style: string;
    delDates: string[];
    destinations: string[];
    buyers: string[];
    vpo: string[];
    packListId: string;
    packListDesc: string;
    dSetItems: PkDSetSubItemAbstractModel[]; // The cut bundles goruped by shade, color and size
    constructor(
        dSetId: number,
        dSetItemId: number,
        moNo: string,
        style: string,
        delDates: string[],
        destinations: string[],
        buyers: string[],
        vpo: string[],
        packListId: string,
        packListDesc: string,
        dSetItems: PkDSetSubItemAbstractModel[],
    ) {
        this.dSetId = dSetId
        this.dSetItemId = dSetItemId
        this.moNo=moNo;
        this.style=style;
        this.delDates=delDates;
        this.destinations=destinations;
        this.buyers=buyers;
        this.vpo = vpo;
        this.packListId = packListId;
        this.packListDesc = packListDesc;
        this.dSetItems=dSetItems;
    }
}