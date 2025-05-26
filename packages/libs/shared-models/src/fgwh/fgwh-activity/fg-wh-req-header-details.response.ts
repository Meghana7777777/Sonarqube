import { GlobalResponseObject } from "../../common";
import { FgWhReqHeaderDetailsModel } from "./fg-wh-req-header-details.model";



export class FgWhReqHeaderDetailsResponse extends GlobalResponseObject {
    data?: FgWhReqHeaderDetailsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: FgWhReqHeaderDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}