import { GlobalResponseObject } from "../../common";
import { ProcessTypeWiseSizeModel } from "./process-type-size-wise.model";

export class ProcessTypeWiseSizeResponse extends GlobalResponseObject {
    data: ProcessTypeWiseSizeModel[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ProcessTypeWiseSizeModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}