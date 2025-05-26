import { GlobalResponseObject } from "../../../common";
import { FgGetAllLocationByRackIdDto } from "./fg-get-all-locations-by-rack-id.dto";



export class FgGetAllLocationByRackIdRes extends GlobalResponseObject{
    LocationsData: FgGetAllLocationByRackIdDto[];
    /**
     * @params status
     * @params errorCode
     * @params internalMessage
     * @param LocationsData
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, LocationsData:FgGetAllLocationByRackIdDto[]){
        super(status, errorCode, internalMessage)
        this.LocationsData = LocationsData;
    }
}