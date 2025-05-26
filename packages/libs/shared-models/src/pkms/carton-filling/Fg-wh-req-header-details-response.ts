import { GlobalResponseObject } from "../../common";
import { FgWhReqHeaderDetailsModel } from "../../fgwh/fgwh-activity/fg-wh-req-header-details.model";
import { CartonFillingModel } from "./carton-filing.model";



export class FgWhReqHeaderDetailsResponse extends GlobalResponseObject {
    data?: FgWhReqHeaderDetailsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: FgWhReqHeaderDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}