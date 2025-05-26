import { CommonRequestAttrs } from "../../../common";
import { ProductTypeModel } from "./product-type.model";

export class ProductTypeRequest extends CommonRequestAttrs {
    productTypes: ProductTypeModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        productTypes: ProductTypeModel[],

    ) {
        super(username, unitCode, companyCode, userId);
        this.productTypes = productTypes;
    }
}