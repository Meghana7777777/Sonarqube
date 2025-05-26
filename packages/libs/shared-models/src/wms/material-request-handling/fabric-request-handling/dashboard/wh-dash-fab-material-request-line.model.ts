import { WhMatReqLineStatusEnum, WhReqByObjectEnum } from "../../enum";
import { WhDashMaterialRequesLineItemModel } from "./wh-dash-fab-material-request-line-item.model";

export class WhDashMaterialRequesLineModel {
    job: string; // this is the docket group
    materialStatus: WhMatReqLineStatusEnum;
    fulfillentDateTime: string;
    requestedDateTime: string;
    materials?: WhDashMaterialRequesLineItemModel[];
  
    constructor(
      job: string,
      materialStatus: WhMatReqLineStatusEnum,
      fulfillentDateTime: string,
      requestedDateTime: string,
      materials?: WhDashMaterialRequesLineItemModel[]
    ) {
      this.job = job;
      this.materialStatus = materialStatus;
      this.fulfillentDateTime = fulfillentDateTime;
      this.requestedDateTime = requestedDateTime;
      this.materials = materials;
    }
  }