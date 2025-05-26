import { LocationAvailability } from "./location-availability.model";
import { LocationCartonDetails } from "./location-details-carton-abstract";


export class LocationContainerCartonInfo {
    rackCapacity: number; // Total bins in the warehouse
    locationsAvailability: LocationAvailability;
    locationDetails: LocationCartonDetails[];
    constructor(
      rackCapacity: number,
      locationsAvailability: LocationAvailability,
      locationDetails: LocationCartonDetails[]
    ) {
      this.rackCapacity = rackCapacity;
      this.locationsAvailability = locationsAvailability;
      this.locationDetails = locationDetails;
    }
  }
  