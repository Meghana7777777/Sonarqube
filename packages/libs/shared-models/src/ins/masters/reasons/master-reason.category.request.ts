import { CommonRequestAttrs } from "../../../common";
import { MasterdataCategoryEnum } from "../../../wms";


export class ReasonsCategoryRequest extends CommonRequestAttrs {
    category: MasterdataCategoryEnum;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, category:MasterdataCategoryEnum){
        super(username,unitCode,companyCode,userId);
        this.category=category;
    }
}
