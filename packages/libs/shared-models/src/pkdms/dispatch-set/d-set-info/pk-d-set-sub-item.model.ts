import { PkDSetSubItemAttrEnum } from "../../enum";

export class PkDSetSubItemsModel {
    id: number; // PK of the d_set_item
    ctnNo: string;
    barcode: string;
    qty: number;
    dSetSubItemAttr: { [k in PkDSetSubItemAttrEnum]: string };
    constructor(
        id: number, 
        ctnNo: string,
        barcode: string,
        qty: number,
        dSetSubItemAttr: { [k in PkDSetSubItemAttrEnum]: string }
    ) {
        this.id = id;
        this.ctnNo = ctnNo;
        this.barcode = barcode;
        this.qty = qty;
        this.dSetSubItemAttr = dSetSubItemAttr;
    }
}