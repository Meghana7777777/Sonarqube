import { PkDSetSubItemBarcodeDetailedModel } from "./pk-d-set-sub-item-barcode-detailed-model";

// BUNDLE d_set_sub_item
export class PkDSetSubItemsBarcodesModel {
    barcode: string;
    quantity: number;
    pk: number;
    detailedInfo: PkDSetSubItemBarcodeDetailedModel; // should send this only when iNeedAllBarcodesDetailedList = true or iNeedPutInBagBarcodeDetailedList

    constructor(barcode: string, quantity: number, pk: number, detailedInfo: PkDSetSubItemBarcodeDetailedModel) {
        this.barcode = barcode;
        this.quantity = quantity;
        this.pk = pk;
        this.detailedInfo = detailedInfo;
    }
}



