import { InsUomEnum } from "@xpparel/shared-models";
import { RollBasicInfoModel } from "../../../packing-list";
import { WhMatReqLineItemStatusEnum, WhMatReqLineStatusEnum, WhReqByObjectEnum } from "../../enum";

export class WhDashMaterialRequesLineItemModel {
    barcode: string;
    rollId: number;
    qty: number;
    uom: InsUomEnum;
    allocQty: number;
    rollStatus: WhMatReqLineItemStatusEnum;
    itemCode: string;
    itemDesc: string;
    basicRollInfo?: RollBasicInfoModel;
  
    constructor(
      barcode: string,
      rollId: number,
      qty: number,
      uom: InsUomEnum,
      allocQty: number,
      rollStatus: WhMatReqLineItemStatusEnum,
      itemCode: string,
      itemDesc: string,
      basicRollInfo?: RollBasicInfoModel
    ) {
      this.barcode = barcode;
      this.rollId = rollId;
      this.qty = qty;
      this.uom = uom;
      this.allocQty = allocQty;
      this.rollStatus = rollStatus;
      this.itemCode = itemCode;
      this.itemDesc = itemDesc;
      this.basicRollInfo = basicRollInfo;
    }
  }