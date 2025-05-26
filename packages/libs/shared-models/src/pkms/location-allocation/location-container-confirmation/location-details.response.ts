import { GlobalResponseObject } from "../../../common";
import { LocationDetailsModel } from "./location-details.model";

export class LocationDetailsResponse extends GlobalResponseObject{
    data?:LocationDetailsModel[];
    
    constructor(status: boolean, errorCode: number, internalMessage: string, data: LocationDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}