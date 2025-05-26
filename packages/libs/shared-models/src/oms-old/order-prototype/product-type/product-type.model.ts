import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ProductTypeCompModel } from "./product-type-comp.model";

export class ProductTypeModel extends CommonRequestAttrs{
    id?: number;
    productType: string;
    productName?: string;
    refNo?: string;
    desc: string;
    components?: ProductTypeCompModel[];

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, productType: string, productName: string, refNo: string, desc: string, components: ProductTypeCompModel[]) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.components=components;
        this.desc=desc;
        this.productName=productName;
        this.productType=productType;
        this.refNo=refNo;

    }
}