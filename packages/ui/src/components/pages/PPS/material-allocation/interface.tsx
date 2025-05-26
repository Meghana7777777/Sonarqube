import { ActualMarkerModel } from "@xpparel/shared-models";

export interface IDisplayDocketInfo {
  sno: number,
  poSerial: number;
  docketNumber: string;
  cutNumber: number;
  totalBundles: number;
  components: string[];
  itemCode: string;
  itemDesc: string;
  productName: string;
  productDesc: string;
  fgColor: string;
  productType: string;
  docketGroup: string;
  plies: number;
  ratioId: number;
  docketGroupId: number;
  ratioName: string;
  ratioDesc: string;
  mName: string;
  mVersion: string;
  mWidth: string;
  mLength: string;
  isMainDoc: boolean;
  hasBinding: boolean;
  bindingRequirement: number;
  originalDocQuantity: number;
  materialRequirement: number;
  allocatedQty: number;
  dgComponents: string[];
  dgDocNumber: string[];
  cutWastage: number;
  reqWithOutWastage:number;// adding for actual marker requirement material
  bindReqWithOutWastage:number;// adding for actual marker requirement material
  actualMarkerInfo: ActualMarkerModel;// to get actual marker length
  remark?:string;


}
