import { CommonRequestAttrs } from "../../../../common";

export class WorkstationIdRequest extends CommonRequestAttrs {
    id?: number;
    wsCode?: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        wsCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.wsCode = wsCode;
    }
}