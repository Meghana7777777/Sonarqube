import { CommonRequestAttrs } from "../../../common";


export class UsersCreationModel extends CommonRequestAttrs {
    groupName: string;
    UsersId: string;
    
   
    constructor(username: string, unitCode: string, companyCode: string, userId: number,groupName: string,UsersId: string){
 
        super(username,unitCode,companyCode,userId);
      
        this.groupName=groupName;
        this.UsersId=UsersId;
        
      
        
      
        
    }
}
