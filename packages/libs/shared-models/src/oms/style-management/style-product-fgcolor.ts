import { CommonRequestAttrs } from "../../common";

export class StyleProductCodeFgColorRequest extends CommonRequestAttrs{
    styleCode:string;
    productCode:string;
    fgColor: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        styleCode:string,
        productCode:string,
        fgColor: string,
    

    ) {
        super(username, unitCode, companyCode, userId);
        this.styleCode = styleCode;
        this.productCode = productCode;
        this.fgColor = fgColor;
    }
}