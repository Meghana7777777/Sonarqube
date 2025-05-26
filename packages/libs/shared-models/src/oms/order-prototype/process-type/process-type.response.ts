import { GlobalResponseObject } from "../../../common";
import { ProcessTypeModel } from "./process-type.model";

export class ProcessTypeResponse extends GlobalResponseObject {
    data?: ProcessTypeModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ProcessTypeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}