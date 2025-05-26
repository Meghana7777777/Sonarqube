import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { OperationCodesRequest } from "./operation-codes.request ";
import { OperationModelInfo } from "./operation-model-info";
import { OperationModel } from "./operation.model";

export class OperationCodesResponse extends GlobalResponseObject {
    data ?: OperationModelInfo[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OperationModelInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}