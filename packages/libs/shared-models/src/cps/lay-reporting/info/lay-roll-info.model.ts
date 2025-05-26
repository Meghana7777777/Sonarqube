import { RollBasicInfoModel } from "../../../wms";
import { LayRollInfoAttrsModel } from "./lay-roll-info-attrs.model";

export class LayRollInfoModel {
    rollId: number;
    rollBarcode: string;
    rollBasicInfo: RollBasicInfoModel;
    itemCode: string;
    itemDesc: string;
    layedPlies: number;
    otherAttributes: LayRollInfoAttrsModel;
  
    constructor(
      rollId: number,
      rollBarcode: string,
      rollBasicInfo: RollBasicInfoModel,
      itemCode: string,
      itemDesc: string,
      layedPlies: number,
      otherAttributes: LayRollInfoAttrsModel
    ) {
      this.rollId = rollId;
      this.rollBarcode = rollBarcode;
      this.rollBasicInfo = rollBasicInfo;
      this.itemCode = itemCode;
      this.itemDesc = itemDesc;
      this.layedPlies = layedPlies;
      this.otherAttributes = otherAttributes;
    }
  }