import { CommonRequestAttrs } from "../../../common";

export class CartonUpcBarCodeReqDto extends CommonRequestAttrs {
    upcBarCodes: string[];
    cartonId: number;
    cartonProtoId: number;
    constructor(upcBarCodes: string[], cartonId: number,
        cartonProtoId: number, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId);
        this.cartonId = cartonId;
        this.cartonProtoId = cartonProtoId;
        this.upcBarCodes = upcBarCodes;

    }
}