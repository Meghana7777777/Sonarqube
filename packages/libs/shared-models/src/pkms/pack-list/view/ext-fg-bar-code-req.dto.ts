import { CommonRequestAttrs } from "../../../common";

export class ExtFgBarCodeReqDto extends CommonRequestAttrs {
    extFgBarCode: string;
    cartonId: number;
    cartonProtoId: number;
    polyBagId: number;
    constructor(
        extFgBarCode: string,
        cartonId: number,
        cartonProtoId: number,
        polyBagId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.cartonId = cartonId;
        this.cartonProtoId = cartonProtoId;
        this.extFgBarCode = extFgBarCode;
        this.polyBagId = polyBagId;
    }
}