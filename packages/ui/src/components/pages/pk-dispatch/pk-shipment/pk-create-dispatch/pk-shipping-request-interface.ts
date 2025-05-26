
import { PkDSetItemNosModel } from "@xpparel/shared-models";

export interface PkManufacturingOrder {
  orderId: string;
  orderNo: string;
  plantStyle?: string;
}

export interface PkDispatchSet {
  id: string;
  moNumber: string;
  cutOrderDesc: string;
  productName: string;
  shippableSetCode: string;
  dSetItems: PkDSetItemNosModel[]; 
}

export interface PkShippingRequest {
  srId: string;
  remarks: string;
}

export interface PkShipmentData {
  moNum: string;
  packListId: string;
  totalCartons: number;
  dsetId: number;
  dSetItemId: number;
  styles: string;
  buyers: string;
  delDates: string;
  vpos: string;
  dSetCode: string;
  productNames: string;
  destinations: string;
  plDesc: string;
  destination: string;
  
  // cutNumber: string;
  // cutSubNumber:string;
  // bags: number;
  // bundles: number;
  // productName: string;
  // containers: any[];
  // dsetId: number;
  // dSetItemId: number;
  // docNumber: string;
  // layId: number;
  // style: string;
  // dSetCode: string;
}


export interface PkShipmentData2 {
  phId: any;
}

export interface PkMoListModel {
  id: string;
  moNumber: string; 
}

export interface PkSelectedDetail {
  productName: string;
  manufacturingOrder: string; 
}


