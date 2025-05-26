import { CommonRequestAttrs } from "../../../common";

export class ProcessTypeIdRequest extends CommonRequestAttrs {
    id?: number;
    processTypeName?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        processTypeName?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.processTypeName = processTypeName;
    }
}