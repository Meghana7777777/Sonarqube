import { InsUomEnum } from "@xpparel/shared-models";

export class SewRawMaterialResponseModel {
    id: number; 
    iOpCode: string;
    product: string;
    productType: string; 
    consumption: string;
    uom: string;
    opVersionId: number; 

    constructor(id: number,iOpCode: string,product: string,productType: string,consumption: string, uom: InsUomEnum, opVersionId: number) {
        this.id = id;
        this.iOpCode = iOpCode; 
        this.product = product; 
        this.productType = productType;
        this.consumption = consumption;
        this.uom = uom;
        this.opVersionId = opVersionId;
    }
}