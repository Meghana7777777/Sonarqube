
import { PkDSetItemNosModel } from "@xpparel/shared-models";

export interface ManufacturingOrder {
  orderId: string;
  orderNo: string;
  plantStyle?: string;
}

export interface DispatchSet {
  id: string;
  moNumber: string;
  cutOrderDesc: string;
  productName: string;
  shippableSetCode: string;
  dSetItems: PkDSetItemNosModel[]; 
}

export interface ShippingRequest {
  srId: string;
  remarks: string;
}

export interface ShipmentData {
  cutNumber: string;
  cutSubNumber:string;
  bags: number;
  bundles: number;
  moNum: string; 
  productName: string;
  containers: any[];
  dsetId: number;
  dSetItemId: number;
  docNumber: string;
  layId: number;
  style: string;
  dSetCode: string;
}


export interface ShipmentData2 {
  phId: any;
}

export interface MoListModel {
  id: string;
  moNumber: string; 
}

export interface SelectedDetail {
  productName: string;
  manufacturingOrder: string; 
}


