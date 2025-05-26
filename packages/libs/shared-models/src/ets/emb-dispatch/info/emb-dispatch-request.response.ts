import { GlobalResponseObject } from "../../../common";
import { EmbDispatchRequestModel } from "./emb-dispatch-request.model";


export class EmbDispatchRequestResponse extends GlobalResponseObject {
    data ?: EmbDispatchRequestModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: EmbDispatchRequestModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}