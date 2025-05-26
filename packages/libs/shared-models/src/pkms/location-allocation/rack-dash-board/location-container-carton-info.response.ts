import { GlobalResponseObject } from "../../../common";
import { LocationContainerCartonInfo } from "./location-container-carton-info.model";

export class LocationContainerCartonInfoResponse extends GlobalResponseObject {
    data?: LocationContainerCartonInfo;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: LocationContainerCartonInfo) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}   