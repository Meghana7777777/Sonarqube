import { CommonRequestAttrs } from "../../../common";
import { InsMasterdataCategoryEnum, InsTypesForMasterEnum } from "../../enum";


export class InsReasonsCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    extCode: string;
    pointValue:string;
    category:InsMasterdataCategoryEnum;
    id: number;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string,code: string,extCode: string,pointValue: string,category:InsMasterdataCategoryEnum){
 
        super(username,unitCode,companyCode,userId);
        this.id = id;
        this.name=names;
        this.code=code;
        this.extCode=extCode;
        this.pointValue=pointValue;
        this.category=category;  
    }
}

export class InsMasterReasonsCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    extCode: string;
    pointValue:string;
    category:InsMasterdataCategoryEnum;
    id: number;
    insType: InsTypesForMasterEnum;
    reasonName: string;
    reasonDesc: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string,code: string,extCode: string,pointValue: string,category:InsMasterdataCategoryEnum, insType: InsTypesForMasterEnum, reasonName: string, reasonDesc: string) {
        super(username,unitCode,companyCode,userId);
        this.id = id;
        this.name=names;
        this.code=code;
        this.extCode=extCode;
        this.pointValue=pointValue;
        this.category=category;
        this.insType = insType;
        this.reasonName = reasonName;
        this.reasonDesc = reasonDesc;  
    }
}
