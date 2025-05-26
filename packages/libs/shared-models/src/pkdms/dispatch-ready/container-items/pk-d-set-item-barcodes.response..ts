import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PkDSetBarcodeModel } from "./pk-d-set-barcode.model";
import { PkDSetItemsBarcodesModel } from "./pk-d-set-items-barcodes.model";

export class PkDSetItemBarcodesResponse extends GlobalResponseObject {
    data: PkDSetItemsBarcodesModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkDSetItemsBarcodesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}