import { DSetSubItemBarcodeDetailedModel } from "./d-set-sub-item-barcode-detailed-model";

// BUNDLE d_set_sub_item
export class DSetSubItemsBarcodesModel {
    barcode: string;
    quantity: number;
    pk: number;
    detailedInfo: DSetSubItemBarcodeDetailedModel; // should send this only when iNeedAllBarcodesDetailedList = true or iNeedPutInBagBarcodeDetailedList

    constructor(barcode: string, quantity: number, pk: number, detailedInfo: DSetSubItemBarcodeDetailedModel) {
        this.barcode = barcode;
        this.quantity = quantity;
        this.pk = pk;
        this.detailedInfo = detailedInfo;
    }
}



