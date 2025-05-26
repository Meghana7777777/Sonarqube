import { CommonRequestAttrs } from "../../../common";

export class ComponentIdRequest extends CommonRequestAttrs {
    id?: number;
    compoentCode?: string; // unique

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        compoentCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.compoentCode = compoentCode;
    }
}