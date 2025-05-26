import { CommonRequestAttrs } from "../../../common";

export class ProductsIdRequest extends CommonRequestAttrs {
    id?: number;
    productName?: string;
    productCode?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        productName?: string,
        productCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.productName = productName;
        this.productCode = productCode;
    }
}