import { CommonRequestAttrs } from "../../../common";

export class PoItemProductModel extends CommonRequestAttrs {
    poSerial: number;
    itemCode: string;
    productName: string;
    fgColor: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        itemCode: string,
        productName: string,
        fgColor: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.itemCode = itemCode;
        this.productName = productName;
        this.fgColor = fgColor;
    }
}
