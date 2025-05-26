import { GlobalResponseObject } from "../../../common";
import { ManufacturingOrderPreviewData } from "./mo-preview.model";

export class MOPreviewResponse extends GlobalResponseObject{
  data?:ManufacturingOrderPreviewData[];
  constructor(status: boolean, errorCode: number, internalMessage: string, data: ManufacturingOrderPreviewData[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}