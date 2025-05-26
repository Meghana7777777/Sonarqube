import { DSetItemsBarcodesModel } from "./d-set-items-barcodes.model";

// SET d_set
export class DSetBarcodeModel {
    dSetNo: string;
    dSetItemBarcodes: DSetItemsBarcodesModel[];

    constructor(dSetNo: string, dSetItemBarcodes: DSetItemsBarcodesModel[]) {
        this.dSetNo = dSetNo;
        this.dSetItemBarcodes = dSetItemBarcodes;
    }
}
