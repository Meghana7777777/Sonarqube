import { CommonRequestAttrs } from "../../common";


export class ConfigGcIdModelDto extends CommonRequestAttrs {
    globalConfigId:number
  
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        globalConfigId:number,
   
    ) { super(username, unitCode, companyCode, userId)
        this.globalConfigId=globalConfigId;
       

       
    }
}    

