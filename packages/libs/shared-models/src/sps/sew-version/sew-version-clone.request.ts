import { CommonRequestAttrs } from "../../common";

export class SewVersionCloneRequest extends CommonRequestAttrs{
    parentOpsVersionId: number;
    productNames: string[];
    poSerial: number;

    constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      parentOpsVersionId: number,
      productNames: string[],
      poSerial: number,
    ) {
      super(username, unitCode, companyCode, userId);
      this.parentOpsVersionId = parentOpsVersionId;
      this.productNames = productNames;
      this.poSerial = poSerial;
    }
  }
  