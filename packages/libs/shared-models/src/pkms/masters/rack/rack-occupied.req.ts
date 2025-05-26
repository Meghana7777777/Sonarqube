import { CommonRequestAttrs } from "../../../common";

export class FgRackOccupiedReq extends CommonRequestAttrs {
    rackId:number; 
    constructor(username: string, unitCode: string, companyCode: string, userId: number,rackId: number){
        super(username,unitCode,companyCode,userId);
        this.rackId=rackId;
    } 
}
