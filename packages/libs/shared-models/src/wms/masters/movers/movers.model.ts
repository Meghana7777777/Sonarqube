import { CommonRequestAttrs } from "../../../common";


export class MoversCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    capacity: string;
    uom:string;
    
   
    constructor(username: string, unitCode: string, companyCode: string, userId: number,names: string,code: string,capacity: string,uom: string){
 
        super(username,unitCode,companyCode,userId);
      
        this.name=names;
        this.code=code;
        this.capacity=capacity;
        this.uom=uom;
      
        
      
        
    }
}
