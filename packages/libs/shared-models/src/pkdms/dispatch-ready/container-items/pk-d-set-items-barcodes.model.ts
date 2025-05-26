import { PkDSetItemAttrEnum } from "../../enum";
import { PkContainerWiseSubItemBarcodeModel } from "./pk-container-wise-sub-item-barcode.model";
import { PkDSetSubItemsBarcodesModel } from "./pk-d-set-sub-items.barcodes.model";

// CUT d_set_item
export class PkDSetItemsBarcodesModel {
    dSetItemId: number;
    printStatus: number; // changed from boolean to number
    attrs: { [k in PkDSetItemAttrEnum]?: string };
    totalSubItemBarcodes?: string[]; // array of barcodes. will send this only on iNeedAllBarcodesList
    dSetSubItemBarcodes: PkDSetSubItemsBarcodesModel[]; // will send this only on iNeedAllBarcodesList
    containerWiseBarcodeMapping?: PkContainerWiseSubItemBarcodeModel[];// only when iNeedBagWiseAbstract
    totalPutInBagSubItemBarcodes?: string[]; // array of barcodes. will send this only on iNeedPutInBagBarcodeList
    putInBagSubItemBarcodes?: PkDSetSubItemsBarcodesModel[]; // will send this only on iNeedPutInBagBarcodeList

    constructor(
        dSetItemId: number,
        printStatus: number,
        attrs: { [k in PkDSetItemAttrEnum]?: string },
        totalSubItemBarcodes: string[],
        dSetSubItemBarcodes: PkDSetSubItemsBarcodesModel[],
        totalPutInBagSubItemBarcodes: string[],
        putInBagSubItemBarcodes: PkDSetSubItemsBarcodesModel[],
        containerWiseBarcodeMapping: PkContainerWiseSubItemBarcodeModel[]
    ) {
        this.dSetItemId = dSetItemId;
        this.printStatus = printStatus;
        this.attrs = attrs;
        this.totalSubItemBarcodes = totalSubItemBarcodes;
        this.totalPutInBagSubItemBarcodes = totalPutInBagSubItemBarcodes;
        this.dSetSubItemBarcodes = dSetSubItemBarcodes;
        this.containerWiseBarcodeMapping = containerWiseBarcodeMapping;
        this.putInBagSubItemBarcodes= putInBagSubItemBarcodes;
    }
}
