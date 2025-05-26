import { GlobalResponseObject } from "../../../common";
import { MrnRequestModel } from "./mrn-request.model";

export class MrnRequestResponse extends GlobalResponseObject {
    data ?: MrnRequestModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MrnRequestModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}