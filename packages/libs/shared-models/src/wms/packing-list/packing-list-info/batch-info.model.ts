import { LotInfoModel } from "./lot-info.model";

export class BatchInfoModel {
    id: number;
    deliveryDate: string;
    batchNumber: string;
    invoiceNumber: string;
    invoiceDate: string;
    remarks: string;
    lotInfo: LotInfoModel[];
  
    constructor(
      id: number,
      deliveryDate: string,
      batchNumber: string,
      invoiceNumber: string,
      invoiceDate: string,
      remarks: string,
      lotInfo: LotInfoModel[]
    ) {
      this.id = id;
      this.deliveryDate = deliveryDate;
      this.batchNumber = batchNumber;
      this.invoiceNumber = invoiceNumber;
      this.invoiceDate = invoiceDate;
      this.remarks = remarks;
      this.lotInfo = lotInfo;
    }
  }