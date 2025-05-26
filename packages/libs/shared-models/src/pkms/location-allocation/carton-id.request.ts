import { CommonRequestAttrs } from "../../common";

export class CartonIdRequest extends CommonRequestAttrs {
    cartonId: number;
    barcode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, cartonId: number, barcode: string) {
        super(username, unitCode, companyCode, userId)
        this.cartonId = cartonId;
        this.barcode = barcode;
    }
}