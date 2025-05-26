import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class Rm_C_OutExtRefIdToGetAllocationsRequest extends CommonRequestAttrs {
  extReqId: number;
  processType?: ProcessTypeEnum;

  constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      extReqId: number,
      processType?: ProcessTypeEnum
  ) {
      super(username, unitCode, companyCode, userId);
      this.extReqId = extReqId;
      this.processType = processType;
  }
}