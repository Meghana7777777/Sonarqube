import { ProcessTypeEnum } from "../oms";
import { GlobalResponseObject } from "./global-response-object";
import { ProcessTypesModel } from "./process-types.model";

export class ProcessTypesResponse extends GlobalResponseObject {
    data?: ProcessTypesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProcessTypesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}