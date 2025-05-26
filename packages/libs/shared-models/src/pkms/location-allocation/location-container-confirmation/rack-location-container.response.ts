import { GlobalResponseObject } from "../../../common";
import { RackLocationContainersModel } from "./rack-location-container.model";

export class RackLocationContainersResponse extends GlobalResponseObject {
    data?: RackLocationContainersModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RackLocationContainersModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

