import { GlobalResponseObject } from "../../../common";
import { SaleOrderPreviewData } from "./so-preview.model";

export class SOPreviewResponse extends GlobalResponseObject{
  data?:SaleOrderPreviewData[];
  constructor(status: boolean, errorCode: number, internalMessage: string, data: SaleOrderPreviewData[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}