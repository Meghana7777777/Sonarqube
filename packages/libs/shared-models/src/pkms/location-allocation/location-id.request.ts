import { CommonRequestAttrs } from "../../common";

export class LocationIdRequest extends CommonRequestAttrs {
    locationId: number;
    barcode: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, locationId: number, barcode: string) {
        super(username, unitCode, companyCode, userId)
        this.locationId = locationId;
        this.barcode = barcode;
    }
}