import { GlobalResponseObject } from "../../../common";
import { RelaxationInfoModel } from "./relaxation.model";

export class RelaxationInfoResponse extends GlobalResponseObject {
    data : RelaxationInfoModel

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RelaxationInfoModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
