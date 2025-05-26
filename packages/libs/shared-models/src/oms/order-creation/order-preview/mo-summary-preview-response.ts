import { GlobalResponseObject } from "../../../common";
import { MoSummaryPreviewData } from "./mo-summary-preview.model";

export class MOSummaryPreviewResponse extends GlobalResponseObject{
  data?:MoSummaryPreviewData[];
  constructor(status: boolean, errorCode: number, internalMessage: string, data: MoSummaryPreviewData[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}