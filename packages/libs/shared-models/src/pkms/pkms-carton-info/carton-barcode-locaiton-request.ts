import { CommonRequestAttrs } from "../../common";

export class CartonBarcodeLocationRequest extends CommonRequestAttrs {
    barcode: string[];
    location: string;

    constructor(barcode: string[], username: string, unitCode: string, companyCode: string, userId: number,location: string) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.location = location;
    }
}