import { CommonRequestAttrs } from "../../common";
import { LocationModel } from "./location-model";


export class LocationCreateRequest extends CommonRequestAttrs {
    location: LocationModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        location: LocationModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.location = location;
    }
}