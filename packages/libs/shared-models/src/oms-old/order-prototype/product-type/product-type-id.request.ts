import { CommonRequestAttrs } from "../../../common";

export class ProductTypeIdRequest extends CommonRequestAttrs {
    productTypeId: number;
    prodTypeCode: string; // unique prod code
    constructor(username: string, unitCode: string, companyCode: string, userId: number,productTypeId: number,prodTypeCode:string){
 
        super(username,unitCode,companyCode,userId);
        this.productTypeId=productTypeId;
        this.prodTypeCode = prodTypeCode;
        this.username=username
        this.unitCode=unitCode
        this.companyCode=companyCode
        this.userId=userId
        
    }
}