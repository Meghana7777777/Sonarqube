export class FgGetAllLocationByRackIdDto{
    rackId: number;
    rackCode: string;
    locationCode: string;
    locationId: number;
    constructor(rackId: number,rackCode: string,locationId: number, locationCode: string){
        this.rackId = rackId;
        this.rackCode = rackCode;
        this.locationId = locationId;
        this.locationCode = locationCode;
    }
}