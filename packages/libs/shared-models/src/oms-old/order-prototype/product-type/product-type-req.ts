import { CommonRequestAttrs } from "../../../common";

export class ProductTypeReq extends CommonRequestAttrs{
    productType:string;

    constructor(username: string,unitCode: string,companyCode: string,userId: number,productType:string){
        super(username, unitCode, companyCode, userId)
        this.productType=productType;
    }

}