import { GlobalResponseObject } from "../../../common";
import { ContainerDetailsModel } from "./container-details.model";

export class ContainerDetailsResponse extends GlobalResponseObject {
    data?: ContainerDetailsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ContainerDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}