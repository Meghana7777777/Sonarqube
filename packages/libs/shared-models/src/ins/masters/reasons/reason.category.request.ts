import { CommonRequestAttrs } from "../../../common";
import { InsMasterdataCategoryEnum, InsTypesForMasterEnum } from "../../enum";

export class InsReasonsCategoryRequest extends CommonRequestAttrs {
    category: InsMasterdataCategoryEnum;
    insType:InsTypesForMasterEnum;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, category:InsMasterdataCategoryEnum,insType?:InsTypesForMasterEnum){
        super(username,unitCode,companyCode,userId);
        this.category=category;
        this.insType=insType;
    }
}
