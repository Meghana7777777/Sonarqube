import { InsInspectionFinalInSpectionStatusEnum } from "../enum";

export class InsInspReqStatusModel {
    inspReqId: number;
    status: InsInspectionFinalInSpectionStatusEnum;

    constructor( inspReqId: number, status: InsInspectionFinalInSpectionStatusEnum) {
      this.inspReqId  = inspReqId;
      this.status = status;
    }
  }