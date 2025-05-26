import { CommonRequestAttrs } from "../../common";

export class UnitsModel {
    id?: number;
    unitName: string;
    code: string;
    companysCode: string;
    location: string;
    address: string;
    isActive: boolean;
    latitude?: string;
    longitude?: string;

    constructor(
      
        id: number,
        unitName: string,
        code: string,
        companysCode: string,
        location: string,
        address: string,
        isActive: boolean,
        latitude?: string,
        longitude?: string
    ) {
        this.id = id;
        this.unitName = unitName;
        this.code = code;
        this.companysCode = companysCode;
        this.location = location;
        this.address = address;
        this.isActive = isActive;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}