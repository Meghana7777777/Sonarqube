import { LocationContainerModel } from "./location-container.model";

export class RackLocationContainersModel {
    rackId: number;
    rackCode: string;
    rackDesc: string;
    totalLocations: number;
    locationInfo: LocationContainerModel[];

    constructor( rackId: number, rackCode: string, rackDesc: string, totalLocations: number, locationInfo: LocationContainerModel[]) {
        this.rackId = rackId;
        this.rackCode = rackCode;
        this.rackDesc = rackDesc;
        this.totalLocations = totalLocations;
        this.locationInfo = locationInfo;
    }
}