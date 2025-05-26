import { CommonRequestAttrs } from "../../common";


export class ConfigMasterModelDto extends CommonRequestAttrs {
    id:number
    code:string;
    name: string;
    globalConfigId?:string;
    ParentId?: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
    id:number,
    code:string,
    name: string,
    globalConfigId?:string,     
    ParentId?: number
    ) { super(username, unitCode, companyCode, userId)
        this.id=id;
        this.code = code;
        this.name=name;
        this.globalConfigId=globalConfigId
        this.ParentId=ParentId

       
    }
}    

