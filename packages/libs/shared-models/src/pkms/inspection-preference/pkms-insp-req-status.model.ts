import { PackFinalInspectionStatusEnum } from "../enum";

 

export class PKMSInspReqStatusModel {
    inspReqId: number;
    status: PackFinalInspectionStatusEnum;

    constructor( inspReqId: number, status: PackFinalInspectionStatusEnum) {
      this.inspReqId  = inspReqId;
      this.status = status;
    }
  }