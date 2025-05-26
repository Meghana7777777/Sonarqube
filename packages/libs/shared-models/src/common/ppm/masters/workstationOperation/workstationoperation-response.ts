import { GlobalResponseObject } from "../../../../common";

export class WorkstationOperationResponse extends GlobalResponseObject {
    data?: any;

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: any) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}