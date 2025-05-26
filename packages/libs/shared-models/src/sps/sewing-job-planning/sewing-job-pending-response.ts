import { GlobalResponseObject } from "../../common";
import { SewingJobPendingDataModel } from "./sewing-job-pending-model";

export class SewingJobPendingDataResponse extends GlobalResponseObject {
    data: SewingJobPendingDataModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: SewingJobPendingDataModel[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

// export class ModuleJobsPendingDataResponse extends GlobalResponseObject {
//   data: ModuleJobsPendingDataModel[];

// constructor(
//   status: boolean,
//   errorCode: number,
//   internalMessage: string,
//   data: SewingJobPendingDataModel[],
// ) {
//   super(status, errorCode, internalMessage);
//   this.data = data;
// }
// }
