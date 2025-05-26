
import { GlobalResponseObject } from "../../../common";
import { RollBasicInfoModel } from "../../../wms";

export class OnFloorRollsModel {
    rollId: number;
    rollBarcode: string;
    releasedOn: string;
    rollInfo: RollBasicInfoModel;
  
    constructor(rollId: number, rollBarcode: string, releasedOn: string, rollInfo: RollBasicInfoModel) {
      this.rollId = rollId;
      this.rollBarcode = rollBarcode;
      this.releasedOn = releasedOn;
      this.rollInfo = rollInfo;
    }
  }
