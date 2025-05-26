import { PkDSetSubItemBarcodeDetailedModel } from "./pk-d-set-sub-item-barcode-detailed-model";
import { PkDSetSubItemsBarcodesModel } from "./pk-d-set-sub-items.barcodes.model";

export class PkContainerWiseSubItemBarcodeModel {
    containerId: number;
    containerName: string;
    containerType: string;
    containerBarcode: string;
    totalBarcodes: string[]; // array of barcodes that are part of this container
    containerBarcodes: PkDSetSubItemsBarcodesModel[]; // should send this only if iNeedBagWiseAbstractWithDetailedBarcodes = true

    constructor(
        containerId: number,
        containerName: string,
        containerType: string,
        containerBarcode: string,
        totalBarcodes: string[],
        containerBarcodes: PkDSetSubItemsBarcodesModel[]
    ) {
        this.containerId = containerId;
        this.containerName = containerName;
        this.containerType = containerType;
        this.containerBarcode = containerBarcode;
        this.totalBarcodes = totalBarcodes;
        this.containerBarcodes = containerBarcodes;
    }
}
