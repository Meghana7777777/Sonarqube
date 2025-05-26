import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DSetBarcodeModel } from "./d-set-barcode.model";

export class DSetBarcodesResponse extends GlobalResponseObject {
    data: DSetBarcodeModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: DSetBarcodeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}