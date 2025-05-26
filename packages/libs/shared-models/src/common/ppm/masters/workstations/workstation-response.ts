import { GlobalResponseObject, WorkstationModel } from "../../../../common";


export class WorkstationResponse extends GlobalResponseObject {
    data?: WorkstationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: WorkstationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
