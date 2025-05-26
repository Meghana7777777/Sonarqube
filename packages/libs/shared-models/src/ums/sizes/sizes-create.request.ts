import { CommonRequestAttrs } from "../../common";

export class SizescreateRequest extends CommonRequestAttrs{
    id:number;
    sizeCode:string[];
    sizeDesc:string[];
    sizeIndex:number[];

    constructor(username: string,unitCode: string,companyCode: string,userId: number,id:number,sizeCode:string[],sizeDesc:string[],sizeIndex:number[]){
        super(username, unitCode, companyCode, userId)
        this.id=id;
        this.sizeCode=sizeCode;
        this.sizeDesc=sizeDesc;
        this.sizeIndex = sizeIndex;
    }

}