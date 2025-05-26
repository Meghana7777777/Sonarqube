import { InsInspReqStatusModel } from "@xpparel/shared-models";
import { RollInfoModel } from "./roll-info.model";

export class LotInfoModel {
  id: number;
  lotNumber: string;
  // TODO: REMOVING MATERIAL DETAILS FROM HERE AND MOVING TO ROLL INFO
  remarks: string;
  rollInfo: RollInfoModel[];
  inspectionDetails: InsInspReqStatusModel[];

  constructor(
    id: number,
    lotNumber: string,
    remarks: string,
    rollInfo: RollInfoModel[],
    inspectionDetails: InsInspReqStatusModel[]
  ) {
    this.id = id;
    this.lotNumber = lotNumber;
    this.remarks = remarks;
    this.rollInfo = rollInfo;
    this.inspectionDetails = inspectionDetails;
  }
}
