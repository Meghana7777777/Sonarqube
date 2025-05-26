import { CommonRequestAttrs } from "../../common";

export class BinIdRequest extends CommonRequestAttrs {
    binId: number;
    barcode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, binId: number, barcode: string) {
        super(username, unitCode, companyCode, userId)
        this.binId = binId;
        this.barcode = barcode;
    }
}