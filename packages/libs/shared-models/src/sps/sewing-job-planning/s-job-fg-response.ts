import { GlobalResponseObject } from "../../common";
import { SJobFgModel } from "./s-job-fg-model";

export class SJobFgResponse extends GlobalResponseObject {
  data: SJobFgModel;

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: SJobFgModel,
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}
