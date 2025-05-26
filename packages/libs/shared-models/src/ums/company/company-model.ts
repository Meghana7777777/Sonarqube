import { CommonRequestAttrs } from "../../common";

export class CompanyModel  {
    id?: number;
    companyName: string;
    code: string;
    location: string;
    address: string;
    isActive: boolean;
    latitude?: string;
    longitude?: string;

    constructor(
       
        id: number,
        companyName: string,
        code: string,
        location: string,
        address: string,
        isActive: boolean,
        latitude?: string,
        longitude?: string
    ) {
        this.id = id;
        this.companyName = companyName;
        this.code = code;
        this.location = location;
        this.address = address;
        this.isActive = isActive;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}