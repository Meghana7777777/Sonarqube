
import { GlobalResponseObject } from "../../../common";
import { FgContainersDetailsModel } from "./fg-containers-details.model";

export class FgContainerDetailsResponse extends GlobalResponseObject {
    data?: FgContainersDetailsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: FgContainersDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}