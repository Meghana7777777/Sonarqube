import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { OperationModel } from "./operation.model";

export class OperationResponse extends GlobalResponseObject {
    data ?: OperationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OperationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}