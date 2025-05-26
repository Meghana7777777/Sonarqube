import { GlobalResponseObject } from "../../../common";
import { CutDispatchRequestModel } from "./cut-dispatch-request.model";

export class CutDispatchRequestResponse extends GlobalResponseObject {
    data ?: CutDispatchRequestModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutDispatchRequestModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}