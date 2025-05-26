import { GlobalResponseObject } from "@xpparel/shared-models";
import { OslIdInfoModel } from "./osl-id-info.model";

export class OslIdInfoResponse extends GlobalResponseObject {
   data ?: OslIdInfoModel[];

   constructor(status: boolean, errorCode: number, internalMessage: string, data: OslIdInfoModel[]) {
      super(status, errorCode, internalMessage);
      this.data = data;
  }

}

