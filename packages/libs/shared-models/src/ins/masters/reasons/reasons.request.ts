import { CommonRequestAttrs } from "../../../common";
import { InsMasterdataCategoryEnum, InsTypesForMasterEnum } from "../../enum";


export class InsReasonsCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    extCode: string;
    pointValue:string;
    category:InsMasterdataCategoryEnum;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,extCode: string,pointValue: string,category:InsMasterdataCategoryEnum,isActive:boolean) {
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.extCode=extCode;
        this.pointValue=pointValue;
        this.category=category;
        this.isActive=isActive;  
    }
}

export class InsMasterReasonsCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    extCode: string;
    pointValue:string;
    category:InsMasterdataCategoryEnum;
    insType: InsTypesForMasterEnum;
    reasonName: string;
    reasonDesc: string;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,extCode: string,pointValue: string,category:InsMasterdataCategoryEnum,isActive:boolean, insType: InsTypesForMasterEnum, reasonName: string, reasonDesc: string) {
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.extCode=extCode;
        this.pointValue=pointValue;
        this.category=category;
        this.isActive=isActive;
        this.insType = insType;
        this.reasonName = reasonName;
        this.reasonDesc = reasonDesc;
        
    }
}
