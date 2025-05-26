import { CommonRequestAttrs } from "../../common";
import { LocationModel } from "./location-model";

export class LocationRequest extends CommonRequestAttrs {
    Location: LocationModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        Location: LocationModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.Location = Location;
    }
}
