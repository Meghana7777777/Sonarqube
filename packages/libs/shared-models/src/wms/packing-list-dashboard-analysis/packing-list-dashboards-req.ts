import { CommonRequestAttrs } from "../../common";

export class UnitDatetimeRequest extends CommonRequestAttrs{
    //unitCode:string;
    fromDate:string;
    toDate:string;
    group?: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,fromDate:string,toDate:string,group?:string){
        super(username,unitCode,companyCode,userId);
        this.fromDate=fromDate;
        this.toDate=toDate;
        this.group = group;
    }
}