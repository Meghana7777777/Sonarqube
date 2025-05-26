import { CommonRequestAttrs } from "../../../common";


export class PalletsActivateRequest extends CommonRequestAttrs {
    id: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id: number){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        
    }
}
