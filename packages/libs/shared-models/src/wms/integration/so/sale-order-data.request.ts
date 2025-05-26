import { CommonRequestAttrs } from "../../../common";

export class SaleOrderNumberRequest extends CommonRequestAttrs{
    saleOrderNo: string;
   
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        saleOrderNo: string  

    ) {
        super(username, unitCode, companyCode, userId);
        this.saleOrderNo = saleOrderNo;
    }
}

// {
//     "saleOrderNo": "311667",
//     "username":"rajesh",
//     "companyCode":"5000",
//     "unitCode":"B3",
//     "userId":0
// }