export class LocationAvailability {
    availableLocationsLocation: string[];   // Locations of available Locations
    availableLocationsCount: number;  // Count of available Locations
  
    constructor(availableLocationsLocation: string[], availableLocationsCount: number) {
      this.availableLocationsLocation = availableLocationsLocation;
      this.availableLocationsCount = availableLocationsCount;
    }
  }
  