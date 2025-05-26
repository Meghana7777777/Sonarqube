import { CommonRequestAttrs } from "../../../common";

export class FgGetLocationByRackIdReq extends CommonRequestAttrs {
    rackId: number;
    constructor(companyCode: string,unitCode: string,username: string,userId: number,rackId: number){
        super(username, unitCode, companyCode, userId)
        this.rackId = rackId
    }
}