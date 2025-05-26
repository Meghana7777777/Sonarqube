import { CommonRequestAttrs } from "../../common";

export class CartonPalletMapRequest extends CommonRequestAttrs {
    cartonBarcode: string;
    palletBarcode: string;
    fgWhReqHeadId?: number;

    constructor(cartonBarcode: string, palletBarcode: string, username: string, unitCode: string, companyCode: string, userId: number, fgWhReqHeadId?: number) {
        super(username, unitCode, companyCode, userId);
        this.cartonBarcode = cartonBarcode;
        this.fgWhReqHeadId = fgWhReqHeadId;        
        this.palletBarcode = palletBarcode;
    }
}