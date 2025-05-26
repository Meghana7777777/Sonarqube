import { CommonRequestAttrs } from "../../../common";
import { ProductsModel } from "./product-model";

export class ProductsRequest extends CommonRequestAttrs{
    product: ProductsModel
    
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        product: ProductsModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.product = product;
    }
}