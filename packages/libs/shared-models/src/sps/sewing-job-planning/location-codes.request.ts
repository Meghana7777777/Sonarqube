import { CommonRequestAttrs } from "../../common";

export class LocationCodesRequest extends CommonRequestAttrs {
    locationCodes: string[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, locationCodes: string[]) {
        super(username, unitCode, companyCode, userId)
        this.locationCodes = locationCodes
    }
}
