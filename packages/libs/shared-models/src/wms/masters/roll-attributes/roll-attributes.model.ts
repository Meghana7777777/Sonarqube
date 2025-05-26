import { CommonRequestAttrs } from "../../../common";


export class RollAttributesCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
   
    constructor(username: string, unitCode: string, companyCode: string, userId: number,names: string,code: string){
 
        super(username,unitCode,companyCode,userId);
      
        this.name=names;
        this.code=code;
        
      
        
    }
}
