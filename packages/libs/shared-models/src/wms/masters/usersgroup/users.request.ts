import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class UsersCreateRequest extends CommonRequestAttrs {
    id:number;
    groupName: string;
    UsersId: string;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,groupName: string,UsersId: string,isActive:boolean){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.groupName=groupName;
        this.UsersId=UsersId;
        this.isActive=isActive;
        
        
    }
}
