import { CommonRequestAttrs } from "../../../common-request-attr.model";

export class WorkstationOperationModel extends CommonRequestAttrs {
    id?: number;
    wsCode: string;
    iOpCode: string;
    opName: string;
    externalRefCode: string;
    isActive: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id: number,
        wsCode: string,
        iOpCode: string,
        opName:string,
        externalRefCode: string,
        isActive: boolean,

    ) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.wsCode = wsCode;
        this.iOpCode = iOpCode;
        this.opName = opName;
        this.externalRefCode = externalRefCode;
        this.isActive = isActive

    }






}