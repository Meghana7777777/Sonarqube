import { CommonRequestAttrs } from "../../common";

export class InsIrIdRequest extends CommonRequestAttrs {
    irId: number;
    isReport?:boolean;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, irId: number,isReport?:boolean){
        super(username,unitCode,companyCode,userId);
        this.irId = irId;
        this.isReport=isReport;
    }
}

