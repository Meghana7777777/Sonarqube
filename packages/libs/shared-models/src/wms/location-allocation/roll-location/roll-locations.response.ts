import { GlobalResponseObject } from "../../../common";
import { RollLocationModel } from "./roll-locations.model";

export class RollLocationsResponse extends GlobalResponseObject {
    data?: RollLocationModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollLocationModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}