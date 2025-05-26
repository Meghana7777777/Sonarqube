import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class MoversCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    capacity: string;
    uom:string;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,capacity: string,uom: string,isActive:boolean){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.capacity=capacity;
        this.uom=uom;
        this.isActive=isActive;
        
        
    }
}
