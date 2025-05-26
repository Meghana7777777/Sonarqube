import { GlobalResponseObject } from "../../common";
import { LocationModel } from "./location-model";


export class LocationResponse extends GlobalResponseObject{
    data?: LocationModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: LocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
