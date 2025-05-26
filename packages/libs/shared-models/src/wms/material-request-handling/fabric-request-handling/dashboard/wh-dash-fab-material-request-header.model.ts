import { PhItemCategoryEnum } from "../../../../common";
import { TaskStatusEnum } from "../../../../cps";
import { WhReqByObjectEnum } from "../../enum";
import { WhDashMaterialRequesLineModel } from "./wh-dash-fab-material-request-line.model";

export class WhDashMaterialRequesHeaderModel {
    id: number;
    requestNo: string;
    requestProgress: TaskStatusEnum;
    reqCreatedOn: string;
    reqFulfillWithin: string;
    reqEntityType: WhReqByObjectEnum;
    reqMaterialType: PhItemCategoryEnum;
    reqLines: WhDashMaterialRequesLineModel[];
  
    constructor(
      id: number,
      requestNo: string,
      requestProgress: TaskStatusEnum,
      reqCreatedOn: string,
      reqFulfillWithin: string,
      reqEntityType: WhReqByObjectEnum,
      reqMaterialType: PhItemCategoryEnum,
      reqLines: WhDashMaterialRequesLineModel[]
    ) {
      this.id = id;
      this.requestNo = requestNo;
      this.requestProgress = requestProgress;
      this.reqCreatedOn = reqCreatedOn;
      this.reqFulfillWithin = reqFulfillWithin;
      this.reqEntityType = reqEntityType;
      this.reqMaterialType = reqMaterialType;
      this.reqLines = reqLines;
    }
  }