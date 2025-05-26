import { CommonRequestAttrs } from "../../common";

export class getChartData{
    deliveryDate:string;
    count:number;

    constructor(deliveryDate:string,
        count:number){
       
        this.deliveryDate=deliveryDate;
        this.count=count;
    }
}