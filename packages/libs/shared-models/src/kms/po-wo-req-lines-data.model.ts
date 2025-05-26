import { GlobalResponseObject } from "../common/global-response-object";

export class PoWhRequestLinesData {
  id:number;
    processingSerial: number;
    processType: string;
    jobNumber: string;
    groupCode: string;
    itemCode: string;
    itemType: string;
    itemName: string;
    itemColor: string;
    requiredQty: number;
    allocatedQty: number;
    issuedQty: number;
  
    constructor(
      id:number,
      processingSerial: number,
      processType: string,
      jobNumber: string,
      groupCode: string,
      itemCode: string,
      itemType: string,
      itemName: string,
      itemColor: string,
      requiredQty: number,
      allocatedQty: number,
      issuedQty: number,
    ) {
      this.id = id; 
      this.processingSerial = processingSerial;
      this.processType = processType;
      this.jobNumber = jobNumber;
      this.groupCode = groupCode;
      this.itemCode = itemCode;
      this.itemType = itemType;
      this.itemName = itemName;
      this.itemColor = itemColor;
      this.requiredQty = requiredQty;
      this.allocatedQty = allocatedQty;
      this.issuedQty = issuedQty;
    }
  }

  
  export class PoWhRequestLinesDataResponse extends GlobalResponseObject {
      data: PoWhRequestLinesData[];
      constructor(status: boolean,
          errorCode: number,
          internalMessage: string,
          data?: PoWhRequestLinesData[]) {
          super(status, errorCode, internalMessage);
          this.data = data;
      }
  }