import { CommonRequestAttrs } from "../../common";

export class RollIdRequest extends CommonRequestAttrs {
    rollId: number;
    barcode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollId: number, barcode: string) {
        super(username, unitCode, companyCode, userId)
        this.rollId = rollId;
        this.barcode = barcode;
    }
}