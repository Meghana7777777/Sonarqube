import { CommonRequestAttrs } from "../../common";

export class MoProductFgColorReq extends CommonRequestAttrs {
    moNumber: string;
    productCode: string;
    fgColor: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moNumber: string,
        productCode: string,
        fgColor: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.productCode = productCode;
        this.fgColor = fgColor;
    }
}
