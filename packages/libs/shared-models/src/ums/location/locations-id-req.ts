import { CommonRequestAttrs } from "../../common";

export class LocationsIdRequest extends CommonRequestAttrs {
    id?: number;
    locationCode?: string; 

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        locationCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.locationCode = locationCode;
    }
}