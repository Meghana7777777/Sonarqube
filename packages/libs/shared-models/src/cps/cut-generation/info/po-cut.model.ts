import { ActualDocketBasicInfoModel } from "../../cut-reporting";
import { DocketBasicInfoModel } from "../../docket";

export class PoCutModel {
    cutId: number; // PK of the cut
    cutNumber: string;
    refDocket: string;
    docketsInvolved: string[];
    poSerial: string;
    moNumber: string;  //Manufacturing order --cut order pending
    moLines: string[];
    planQuantity: number; //total qnty
    plannedBundles: number;  //planned bundles
    generateOn: string;
    // NEW for dispatch screen
    dispatchCreated: boolean;
    dispatchReqNo: string;
    productName: string;
    fgColor: string;
    cutSubNumber: string;
    dockets?: DocketBasicInfoModel[]; 
    actualDockets?: ActualDocketBasicInfoModel[];
    
  
    constructor(
      cutId: number,
      cutNumber: string,
      refDocket: string,
      docketsInvolved: string[],
      poSerial: string,
      moNumber: string,
      moLines: string[],
      planQuantity: number,
      plannedBundles: number,
      generateOn: string,
      dispatchCreated: boolean,
      dispatchReqNo: string,
      productName: string,
      fgColor: string,
      cutSubNumber: string,
      dockets?: DocketBasicInfoModel[],
      actualDockets?: ActualDocketBasicInfoModel[],
      
    ) {
      this.cutId = cutId;
      this.cutNumber = cutNumber;
      this.refDocket = refDocket;
      this.docketsInvolved = docketsInvolved;
      this.poSerial = poSerial;
      this.moNumber = moNumber;
      this.moLines = moLines;
      this.planQuantity = planQuantity;
      this.plannedBundles = plannedBundles;
      this.generateOn = generateOn;
      this.dockets = dockets;
      this.actualDockets = actualDockets;
      this.dispatchCreated = dispatchCreated;
      this.dispatchReqNo = dispatchReqNo;
      this.productName = productName;
      this.fgColor = fgColor;
      this.cutSubNumber = cutSubNumber;
    }
  }