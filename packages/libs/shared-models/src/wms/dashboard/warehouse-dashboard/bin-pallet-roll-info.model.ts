import { BinDetailsModel } from "../../location-allocation";
import { BinAvailability } from "./bin-availability.model";
import { BinRollDetails } from "./bin-details-roll-abstract";

export class BinPalletRollInfo {
    rackCapacity: number; // Total bins in the warehouse
    binsAvailability: BinAvailability;
    binDetails: BinRollDetails[];
    constructor(
      rackCapacity: number,
      binsAvailability: BinAvailability,
      binDetails: BinRollDetails[]
    ) {
      this.rackCapacity = rackCapacity;
      this.binsAvailability = binsAvailability;
      this.binDetails = binDetails;
    }
  }
  