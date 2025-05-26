import { PkShippingRequestProceedingEnum } from "@xpparel/shared-models";

export interface ShippingRequestModel {
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
  
export interface DSetItemsModel {
    id: number;
    containers: string[];
  }
  
  export interface DataType {
    key: number;
    mo: string;
    cutOrder: string;
    productName: string;
    cutNumbers: number;
    quantity?: number;
    bags: number;
  }


  export interface IPendingDHeader {
    id: string | number;
    reqNo: string;         // Shipping request number
    quantity: number;      // Total quantity
    totalCuts: number;     // Total cuts
    totalBags: number;     // Total bags
    totalBundles: number;  // Total bundles
    approveStatus: PkShippingRequestProceedingEnum;
    chid: IPendingDInline[];
  }

  export interface IPendingDInline {
    MO: string;           // manufacturing order number
    cutOrder: string;     // Cut order
    productName: string;  // Product name
    cutNumbers: string;    // Cut numbers as a string
    quantity: number;      // Total quantity
    bags: number;          // Number of bags
  }
  
  
  