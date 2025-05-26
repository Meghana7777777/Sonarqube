export class BinAvailability {
    availableBinsLocation: string[];   // Locations of available bins
    availableBinsCount: number;  // Count of available bins
  
    constructor(availableBinsLocation: string[], availableBinsCount: number) {
      this.availableBinsLocation = availableBinsLocation;
      this.availableBinsCount = availableBinsCount;
    }
  }
  