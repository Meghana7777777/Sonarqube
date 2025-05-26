import { CommonRequestAttrs } from "../../common";

export class StyleProductRequest extends CommonRequestAttrs{
    styleCode:string;
    productType:string
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        styleCode:string,
        productType:string
    

    ) {
        super(username, unitCode, companyCode, userId);
        this.styleCode = styleCode;
        this.productType = productType;
    }
}