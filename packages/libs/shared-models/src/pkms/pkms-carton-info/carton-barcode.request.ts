import { CommonRequestAttrs } from "../../common";

export class CartonBarcodeRequest extends CommonRequestAttrs {
    barcode: string;
    fgwhreqHeadId?: number;

    constructor(barcode: string, username: string, unitCode: string, companyCode: string, userId: number, fgwhreqHeadId?: number) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.fgwhreqHeadId = fgwhreqHeadId
    }
}