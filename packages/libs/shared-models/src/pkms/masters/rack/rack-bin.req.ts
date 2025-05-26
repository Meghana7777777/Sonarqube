import { CommonRequestAttrs } from "@xpparel/shared-models";


export class FgRackIdReq extends CommonRequestAttrs {
    rackId:number; 
    rackLevel:number; 
    rackColumn:number; 
    constructor(username: string, unitCode: string, companyCode: string, userId: number,rackId: number, rackLevel: number,rackColumn: number){
        super(username,unitCode,companyCode,userId);
        this.rackId=rackId;
        this.rackLevel=rackLevel;
        this.rackColumn=rackColumn;
    } 
}
