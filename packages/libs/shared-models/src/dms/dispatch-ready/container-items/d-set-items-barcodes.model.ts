import { DSetItemAttrEnum } from "../../enum";
import { ContainerWiseSubItemBarcodeModel } from "./container-wise-sub-item-barcode.model";
import { DSetSubItemsBarcodesModel } from "./d-set-sub-items.barcodes.model";

// CUT d_set_item
export class DSetItemsBarcodesModel {
    dSetItemId: number;
    printStatus: number; // changed from boolean to number
    attrs: { [k in DSetItemAttrEnum]?: string };
    totalSubItemBarcodes?: string[]; // array of barcodes. will send this only on iNeedAllBarcodesList
    dSetSubItemBarcodes: DSetSubItemsBarcodesModel[]; // will send this only on iNeedAllBarcodesList
    containerWiseBarcodeMapping?: ContainerWiseSubItemBarcodeModel[];// only when iNeedBagWiseAbstract
    totalPutInBagSubItemBarcodes?: string[]; // array of barcodes. will send this only on iNeedPutInBagBarcodeList
    putInBagSubItemBarcodes?: DSetSubItemsBarcodesModel[]; // will send this only on iNeedPutInBagBarcodeList

    constructor(
        dSetItemId: number,
        printStatus: number,
        attrs: { [k in DSetItemAttrEnum]?: string },
        totalSubItemBarcodes: string[],
        dSetSubItemBarcodes: DSetSubItemsBarcodesModel[],
        totalPutInBagSubItemBarcodes: string[],
        putInBagSubItemBarcodes: DSetSubItemsBarcodesModel[],
        containerWiseBarcodeMapping: ContainerWiseSubItemBarcodeModel[]
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
