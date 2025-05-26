import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PkDSetBarcodeModel } from "./pk-d-set-barcode.model";

export class PkDSetBarcodesResponse extends GlobalResponseObject {
    data: PkDSetBarcodeModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PkDSetBarcodeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}