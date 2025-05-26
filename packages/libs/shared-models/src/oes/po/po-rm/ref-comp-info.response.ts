import { GlobalResponseObject } from "../../../common";
import { RefCompDetailModel } from "./ref-comp-info.model";

export class RefComponentInfoResponse extends GlobalResponseObject {
    data: RefCompDetailModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: RefCompDetailModel
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
