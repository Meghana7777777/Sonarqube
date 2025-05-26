import { PackListCartoonIDs, PkShippingRequestProceedingEnum } from "@xpparel/shared-models";

export interface PkShippingRequestModel {
  id: string;
  reqNo: string;
  quantity: number;
  totalDSetItems: number;
  totalContainers: number;
  totalDSetSubItems: number;
  totalDSets: number;
  totalItems: number;
  aodPrintStatus: string;
  shippingInfo: string;
  shippingReqAttrs?: Record<string, any>;
}

export interface PkDSetItemsModel {
  id: number;
  containers: string[];
}

export interface PkDataType {
  key: number;
  mo: string;
  cutOrder: string;
  productName: string;
  cutNumbers: number;
  quantity?: number;
  bags: number;
}


export interface PkIPendingDHeader {
  id: string | number;
  reqNo: string;         // Shipping request number
  totalCartons: number;
  totalFgs: number; 
  styles: string; // csv
  vpo: string; // csv
  moNos: string; // csv
  buyers: string; // csv
  delDates: string; // csv
  destinations: string; // csv
  approveStatus: PkShippingRequestProceedingEnum;
  chid: PkIPendingDInline[];
}


export interface PkIPendingDInline {
  MO: string;           // manufacturing order number
  poNo: string;     // Po number
  styles: string;  // styles
  buyers: string;    // buyers
  destinations: string;      // destinations
  delDates: string;          // delivery dates
  drReqNo: string;
  packlistIds:string[],
  srId: number, // shipping request id
  packListCartoonIds: PackListCartoonIDs[];
  fgOutReqCreated?: boolean;
}


