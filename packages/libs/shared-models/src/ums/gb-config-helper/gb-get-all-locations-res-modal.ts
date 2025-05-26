import { GlobalResponseObject } from "../../common";  
import { GbGetAllLocationsDto } from "./gb-get-all-locations-res-dto";

export class GbGetAllLocationsResponseModal extends GlobalResponseObject {
    data: GbGetAllLocationsDto[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: GbGetAllLocationsDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}