import { ProcessTypeEnum } from "../../oms";


// OperationInfo class
export class OperationInfo {
    operationCode: string;
    operationType: ProcessTypeEnum;
    smv: number;
  
    constructor(operationCode: string, operationType: ProcessTypeEnum, smv: number) {
      this.operationCode = operationCode;
      this.operationType = operationType;
      this.smv = smv;
    }
  }
  
  // TrimGroupInfo class
 export  class TrimGroupInfo {
    itemCode: string;
    consumption: number;
    uom: string;
  
    constructor(itemCode: string, consumption: number, uom: string) {
      this.itemCode = itemCode;
      this.consumption = consumption;
      this.uom = uom;
    }
  }
  
  // MaterialInfo class
export class MaterialInfo {
    trimGroup: string;
    trimGroupInfo: TrimGroupInfo[];
  
    constructor(trimGroup: string, trimGroupInfo: TrimGroupInfo[]) {
      this.trimGroup = trimGroup;
      this.trimGroupInfo = trimGroupInfo;
    }
  }
  
  // JobGroup class
export class JobGroupOpsInfo {
    jobGroupId: number; // Unique identifier for the job group
    jobGroupType: ProcessTypeEnum; // Type of the job group
    operations: OperationInfo[]; // List of operations
    materialInfo: MaterialInfo[]; // Material information related to the job group
  
    constructor(
      jobGroupId: number,
      jobGroupType: ProcessTypeEnum,
      operations: OperationInfo[],
      materialInfo: MaterialInfo[]
    ) {
      this.jobGroupId = jobGroupId;
      this.jobGroupType = jobGroupType;
      this.operations = operations;
      this.materialInfo = materialInfo;
    }
}

export class JobGroupVersionInfoForSewSerial {
  sewSerial: number;
  sewOrderId: number;
  productName: string;
  jobGroupInfo : JobGroupOpsInfo[]
}
  