import { GlobalResponseObject } from "../../../common";
import { InsMasterReasonsCreationModel, InsReasonsCreationModel } from "./reasons.model";


export class InsReasonsResponse extends GlobalResponseObject {
    data?: InsReasonsCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: InsReasonsCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}

export class InsMasterReasonsResponse extends GlobalResponseObject {
    data?: InsMasterReasonsCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: InsMasterReasonsCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}