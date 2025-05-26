import { PoRatioSizeModel } from "packages/libs/shared-models/src/oes";
import { CutStatusEnum, LayingStatusEnum } from "../../../enum";
import { AdBundleModel } from "../bundles/ad-bundle.model";


export class ActualDocketBasicInfoModel {
    layId: number; 
    poSerial: number;
    docketNumber: string;
    docketGroup: string;
    itemCode: string;
    itemDesc: string;
    docketPlies: number;
    actualDocketPlies: number; //layed plies
    productName: string;
    productType: string;
    cutNumber: number;
    cutSubNumber: number;
    layNumber: number; //lay number
    underPolayNumber: number;
    totalAdbs: number;   //sum of 
    layStatus: LayingStatusEnum;
    cutStatus: CutStatusEnum;  //cut status
    labelsPrintStatus: boolean;
    moNo: string;
    moLines: string[];
    components: string[];
    sizeRatios: PoRatioSizeModel[];
    adBundles: AdBundleModel[];
    isMainDoc: boolean;
    color: string;
    originalDocQuantity: number;
    // NEW for dispatch screen
    dispatchCreated: boolean;
    dispatchReqNo: string;
    plantRefStyle : string;
    garmentPo : string;
    garmentPoItem : string;
  
    constructor(
      layId: number,
      poSerial: number,
      docketNumber: string,
      docketGroup: string,
      itemCode: string,
      itemDesc: string,
      docketPlies: number,
      actualDocketPlies: number,
      productName: string,
      productType: string,
      cutNumber: number,
      cutSubNumber: number,
      layNumber: number,
      underPolayNumber: number,
      totalAdbs: number,
      layStatus: LayingStatusEnum,
      cutStatus: CutStatusEnum,
      labelsPrintStatus: boolean,
      moNo: string,
      moLines: string[],
      components: string[],
      sizeRatios: PoRatioSizeModel[],
      adBundles: AdBundleModel[],
      isMainDoc: boolean,
      color: string,
      originalDocQuantity: number,
      dispatchCreated: boolean,
      dispatchReqNo: string,
      plantRefStyle: string,
      garmentPo: string,
      garmentPoItem: string
    ) {
      this.layId = layId;
      this.poSerial = poSerial;
      this.docketNumber = docketNumber;
      this.docketGroup = docketGroup;
      this.itemCode = itemCode;
      this.itemDesc = itemDesc;
      this.docketPlies = docketPlies;
      this.actualDocketPlies = actualDocketPlies;
      this.productName = productName;
      this.productType = productType;
      this.cutNumber = cutNumber;
      this.cutSubNumber = cutSubNumber;
      this.layNumber = layNumber;
      this.underPolayNumber = underPolayNumber;
      this.totalAdbs = totalAdbs;
      this.layStatus = layStatus;
      this.cutStatus = cutStatus;
      this.labelsPrintStatus = labelsPrintStatus;
      this.moNo = moNo;
      this.moLines = moLines;
      this.components = components;
      this.sizeRatios = sizeRatios;
      this.adBundles = adBundles;
      this.isMainDoc = isMainDoc;
      this.color = color;
      this.originalDocQuantity = originalDocQuantity;
      this.dispatchCreated = dispatchCreated;
      this.dispatchReqNo = dispatchReqNo;
      this.plantRefStyle = plantRefStyle;
      this.garmentPo = garmentPo;
      this.garmentPoItem = garmentPoItem;
    }
  }

