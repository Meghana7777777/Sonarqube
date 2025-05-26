import { CommonRequestAttrs } from "../../../common";

export class StagesRequest extends CommonRequestAttrs {
    packageId:string[];
    //unitCode:string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,packageId:string[]){
 
        super(username,unitCode,companyCode,userId);
        this.packageId=packageId;
        
    }
}
