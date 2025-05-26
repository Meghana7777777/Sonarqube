import { GlobalResponseObject } from "../../../common";
import { CartonLocationModel } from "./carton-locations.model";

export class CartonLocationsResponse extends GlobalResponseObject {
    data?: CartonLocationModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: CartonLocationModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
    }
}