import { DSetSubItemBarcodeDetailedModel } from "./d-set-sub-item-barcode-detailed-model";
import { DSetSubItemsBarcodesModel } from "./d-set-sub-items.barcodes.model";

export class ContainerWiseSubItemBarcodeModel {
    containerId: number;
    containerName: string;
    containerType: string;
    containerBarcode: string;
    totalBarcodes: string[]; // array of barcodes that are part of this container
    containerBarcodes: DSetSubItemsBarcodesModel[]; // should send this only if iNeedBagWiseAbstractWithDetailedBarcodes = true

    constructor(
        containerId: number,
        containerName: string,
        containerType: string,
        containerBarcode: string,
        totalBarcodes: string[],
        containerBarcodes: DSetSubItemsBarcodesModel[]
    ) {
        this.containerId = containerId;
        this.containerName = containerName;
        this.containerType = containerType;
        this.containerBarcode = containerBarcode;
        this.totalBarcodes = totalBarcodes;
        this.containerBarcodes = containerBarcodes;
    }
}
