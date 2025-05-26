import { GlobalResponseObject, RollLocationEnum, RollReceivingConfirmationStatusEnum } from "../../../common";
import { FabUtilizationModel } from "./fab-utilization.model";

export class LockedFabMaterialModel {
    id: number;
    itemCode: string;
    itemDesc: string;
    itemNo: string;
    barcode: string;
    itemId: number;
    originalQty: number;
    consumedQty: number;
    actualShade: string;
    lotNo: string;
    currentLocation: RollLocationEnum;
    rollPresenceConfStatus: RollReceivingConfirmationStatusEnum;
    reasonId: number;
    remarks: string;
    utilizationHistory: FabUtilizationModel[];
  
    constructor(
      id: number,
      itemCode: string,
      itemDesc: string,
      itemNo: string,
      barcode: string,
      itemId: number,
      originalQty: number,
      consumedQty: number,
      actualShade: string,
      lotNo: string,
      currentLocation: RollLocationEnum,
      rollPresenceConfStatus: RollReceivingConfirmationStatusEnum,
      reasonId: number,
      remarks: string,
      utilizationHistory: FabUtilizationModel[]
    ) {
      this.id = id;
      this.itemCode = itemCode;
      this.itemDesc = itemDesc;
      this.itemNo = itemNo;
      this.barcode = barcode;
      this.itemId = itemId;
      this.originalQty = originalQty;
      this.consumedQty = consumedQty;
      this.actualShade = actualShade;
      this.lotNo = lotNo;
      this.currentLocation = currentLocation;
      this.rollPresenceConfStatus = rollPresenceConfStatus;
      this.reasonId = reasonId;
      this.remarks = remarks;
      this.utilizationHistory = utilizationHistory;
    }
  }