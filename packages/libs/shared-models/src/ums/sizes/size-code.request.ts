import { CommonRequestAttrs } from "../../common";

export class SizeCodeRequest extends CommonRequestAttrs{
    sizeCode:string;

    constructor(username: string,unitCode: string,companyCode: string,userId: number,sizeCode:string){
        super(username, unitCode, companyCode, userId)
        this.sizeCode=sizeCode;
    }

}