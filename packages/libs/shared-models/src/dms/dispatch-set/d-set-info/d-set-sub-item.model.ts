import { DSetSubItemAttrEnum } from "../../enum";

export class DSetSubItemsModel {
    id: number; // PK of the d_set_item
    bundleNumber: string;
    bundleQty: number;
    dSetSubItemAttr: { [k in DSetSubItemAttrEnum]: string };
    constructor(
        id: number, 
        bundleNumber: string,
        bundleQty: number
    ) {
        this.id = id;
        this.bundleNumber = bundleNumber;
        this.bundleQty = bundleQty;
    }
}