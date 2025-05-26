import { GlobalResponseObject } from "../../common";
import { SJobLineOperationsModel } from "./s-job-line-operations.model";

export class SJobLineOperationsResponse extends GlobalResponseObject {
  data?: SJobLineOperationsModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: SJobLineOperationsModel[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}
