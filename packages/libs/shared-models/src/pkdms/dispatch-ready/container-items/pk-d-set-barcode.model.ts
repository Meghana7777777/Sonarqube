import { PkDSetItemsBarcodesModel } from "./pk-d-set-items-barcodes.model";

// SET d_set
export class PkDSetBarcodeModel {
    dSetNo: string;
    dSetItemBarcodes: PkDSetItemsBarcodesModel[];

    constructor(dSetNo: string, dSetItemBarcodes: PkDSetItemsBarcodesModel[]) {
        this.dSetNo = dSetNo;
        this.dSetItemBarcodes = dSetItemBarcodes;
    }
}
