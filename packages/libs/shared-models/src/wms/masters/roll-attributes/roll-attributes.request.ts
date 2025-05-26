import { CommonRequestAttrs } from "../../../common";


export class RollAttributesCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,isActive:boolean){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.isActive=isActive;
        
        
    }
}
