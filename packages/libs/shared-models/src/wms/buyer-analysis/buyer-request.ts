import { CommonRequestAttrs } from "../../common";

export class BuyerRequest extends CommonRequestAttrs{
    fromDate : string;
    toDate : string ;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,fromDate:string,toDate:string){
        super(username,unitCode,companyCode,userId);
        this.fromDate=fromDate;
        this.toDate=toDate;
    }
}