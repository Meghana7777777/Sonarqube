import { GlobalResponseObject } from "../../common";
import { BatchCodeModel } from "./batch-code.model";


export class BatchCodesResponse extends GlobalResponseObject {
    data: BatchCodeModel[];  
    
    constructor(status: boolean, errorCode: number, internalMessage: string, data: BatchCodeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}