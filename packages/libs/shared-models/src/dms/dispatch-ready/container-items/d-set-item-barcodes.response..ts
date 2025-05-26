import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DSetBarcodeModel } from "./d-set-barcode.model";
import { DSetItemsBarcodesModel } from "./d-set-items-barcodes.model";

export class DSetItemBarcodesResponse extends GlobalResponseObject {
    data: DSetItemsBarcodesModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: DSetItemsBarcodesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}