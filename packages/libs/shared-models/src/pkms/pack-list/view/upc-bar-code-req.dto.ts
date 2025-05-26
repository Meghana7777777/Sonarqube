import { CommonRequestAttrs } from "../../../common";
import { FgsInfoDto } from "../creation";

export class UpcBarCodeReqDto extends CommonRequestAttrs {
    upcBarCode: string;
    cartonId: number;
    cartonProtoId: number;
    polyBagId: number;
    externalFgBarcode: string;//called from the external FG level scanning
    oslId: number;//called from the external FG level scanning
    constructor(
        upcBarCode: string,
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
        this.upcBarCode = upcBarCode;
        this.polyBagId = polyBagId;
    }
}