import { PLArrivalDetails } from "./pl-arrival-details";


export class SupWisePLArrivalDetail {
  supplierName: string;
  supplierCode: string;
  plArrivals: PLArrivalDetails[];

  constructor(supplierName: string, supplierCode: string, plArrivals: PLArrivalDetails[]) {
    this.supplierName = supplierName;
    this.supplierCode = supplierCode;
    this.plArrivals = plArrivals;
  }
}
