import { CommonRequestAttrs } from "../../../common";
import { MasterdataCategoryEnum } from "../../../wms";



export class ReasonsCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    extCode: string;
    pointValue:string;
    category:MasterdataCategoryEnum;
    id: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string,code: string,extCode: string,pointValue: string,category:MasterdataCategoryEnum){
 
        super(username,unitCode,companyCode,userId);
        this.id = id;
        this.name=names;
        this.code=code;
        this.extCode=extCode;
        this.pointValue=pointValue;
        this.category=category;
        
      
        
    }
}
