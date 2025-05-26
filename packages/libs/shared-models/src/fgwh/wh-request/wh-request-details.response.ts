import { GlobalResponseObject } from "../../common";
import { FgWhReqHeaderModel } from "./wh-request.model";

export class WhRequestHeadResponse extends GlobalResponseObject{
    data : FgWhReqHeaderModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgWhReqHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   