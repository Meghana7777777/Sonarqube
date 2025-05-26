import { CommonRequestAttrs } from "../../../common";

export class ManufacturingOrderNumberRequest extends CommonRequestAttrs{
    manufacturingOrderNos: string[];
   
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderNos: string[]  

    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderNos = manufacturingOrderNos;
    }
}

// {
//     "manufacturingOrderNo": "311667",
//     "username":"rajesh",
//     "companyCode":"5000",
//     "unitCode":"B3",
//     "userId":0
// }