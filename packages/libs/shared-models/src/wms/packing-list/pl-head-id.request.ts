import { CommonRequestAttrs } from "../../common";

export class PLHeadIdReq extends CommonRequestAttrs {
    phId: number;
    constructor( phId: number,username?: string, unitCode?: string, companyCode?: string, userId?: number){
        super(username, unitCode, companyCode, userId);
        this.phId = phId
    }
}
