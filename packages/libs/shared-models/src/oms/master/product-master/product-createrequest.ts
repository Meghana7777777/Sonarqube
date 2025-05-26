import { ProductsModel } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../../common";


export class ProductsCreateRequest extends CommonRequestAttrs {
    product: ProductsModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        product: ProductsModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.product = product;
    }
}