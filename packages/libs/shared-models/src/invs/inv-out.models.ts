import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";

export enum InvOutRequestStatusEnum {
    OPEN = 0,
    APPROVED = 1,
    PARTIAL = 2,
    ISSUED = 3
}

// used when getting the out requests based on the PK
export class INV_C_InvOutIdRequest extends CommonRequestAttrs {
    invOutRequestPk: number; // PK of the inv_out_request
    requestStatus: InvOutRequestStatusEnum;
    iNeedBundles: boolean;
}

// used when getting the out requests based on the job number
export class INV_C_InvOutJobNumberRequest extends CommonRequestAttrs {
    jobNumber: number; // PK of the inv_out_request
    processType: ProcessTypeEnum;
    requestStatus: InvOutRequestStatusEnum;
    iNeedBundles: boolean;
}

// This is the PK of the KMS or the SPS
export class INV_C_InvOutExtRefIdRequest extends CommonRequestAttrs {
    extReqId: number; // PK of the SPS / KMS material req header
    requestStatus: InvOutRequestStatusEnum;
    processType: ProcessTypeEnum;
    iNeedBundles: boolean;
}


// {
//     "extReqId": 
//     "allocateWithBalances": false,
//     "allocatingDate": "2024-04-30",
//     "requestStatus": 0,
//     "processType": "LINK",
//     "iNeedBundles": false
//      "username": "admin",
//      "unitCode": "NORLANKA",
//      "companyCode": "NORLANKA",
// }


export class INV_C_InvOutAllocExtRefIdRequest extends CommonRequestAttrs {
    extReqId: number; // PK of the SPS / KMS material req header
    allocateWithBalances: boolean;
    allocatingDate: string;
    requestStatus: InvOutRequestStatusEnum;
    processType: ProcessTypeEnum;
    iNeedBundles: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        extReqId: number, // PK of the SPS / KMS material req header
        allocateWithBalances: boolean,
        allocatingDate: string,
        requestStatus: InvOutRequestStatusEnum,
        processType: ProcessTypeEnum,
        iNeedBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.extReqId = extReqId;
        this.allocateWithBalances = allocateWithBalances;
        this.allocatingDate = allocatingDate;
        this.requestStatus = requestStatus;
        this.processType = processType;
        this.iNeedBundles = iNeedBundles;
    }

}

// {
//     "extReqId": 1,
//     "processType": "LINK",
//      "username": "admin",
//      "unitCode": "NORLANKA",
//      "companyCode": "NORLANKA",
// }

export class INV_C_InvOutExtRefIdToGetAllocationsRequest extends CommonRequestAttrs {
    extReqId: number; // PK of the SPS / KMS material req header
    processType: ProcessTypeEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        extReqId: number,
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.extReqId = extReqId;
        this.processType = processType;
    }
}


// {
//     "allocationId": 5,
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "iNeedBundles": true
// }

export class INV_C_InvOutAllocIdRequest extends CommonRequestAttrs {
  allocationId: number; // PK of the inv out allocation
  issuedDate: string;
  issuedBy: string;
  iNeedBundles: boolean;

  constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      allocationId: number,
      issuedDate: string,
      issuedBy: string,
      iNeedBundles: boolean
  ) {
      super(username, unitCode, companyCode, userId);
      this.allocationId = allocationId;
      this.issuedDate = issuedDate;
      this.issuedBy = issuedBy;
      this.iNeedBundles = iNeedBundles;
  }
}



export class INV_R_InvOutAllocationInfoAndBundlesResponse extends GlobalResponseObject{
    data?: INV_R_InvOutAllocationInfoAndBundlesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: INV_R_InvOutAllocationInfoAndBundlesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class INV_R_InvOutAllocationInfoAndBundlesModel {
    allocationId: number;
    allocatedBy: string;
    allocatedDate: string; // date time
    issued: boolean;
    issuedBy: string;
    issuedDate: string;
    forcedPartialAllocation: boolean;
    toProcType: ProcessTypeEnum;
    bundles: INV_R_InvOutAllocationBundleModel[];
    refId: number; // PK of the WH request
}

export class INV_R_InvOutAllocationBundleModel {
    itemSku: string;
    bunBarcode: string;
    pslId: number;
    aQty: number; // allocated qty
    rQty: number; // requested qty
    iQty: number; // issued qty
    issued: boolean;
}



export class INV_C_PslIdsRequest extends CommonRequestAttrs {
    pslIds: string[] = []
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        pslIds: string[],
    ) {
        super(username, unitCode, companyCode, userId)
        this.pslIds = pslIds
    }
}