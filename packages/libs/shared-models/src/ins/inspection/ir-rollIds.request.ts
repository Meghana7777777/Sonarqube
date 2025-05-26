import { CommonRequestAttrs } from "../../common";

export class InsIrRollIdsRequest extends CommonRequestAttrs {
    irId: number;
    rollIds: number[]
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, irId: number, rollIds: number[]){
        super(username,unitCode,companyCode,userId);
        this.irId = irId;
        this.rollIds = rollIds;
    }
}