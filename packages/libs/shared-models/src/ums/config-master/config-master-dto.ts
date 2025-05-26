import { CommonRequestAttrs } from "../../common";


export class ConfigMasterCreateReq extends CommonRequestAttrs {
    id: number
    code: string;
    name: string;
    globalConfigId: number;
    parentId?: number; 
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        id: number,
        code: string,
        name: string,
        globalConfigId: number,
        parentId?: number 

    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.code = code;
        this.name = name;
        this.globalConfigId = globalConfigId;
        this.parentId = parentId; 

    }
}

