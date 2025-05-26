import { CommonRequestAttrs, GlobalResponseObject, SpsBundleInventoryMoveToInvStatusEnum } from "../../common";
import { ProcessTypeEnum } from "../../oms";


// {
//   "procSerial": 1,
//   "prodName": "Shirt-01",
//   "fgColor": "Navy Blue",
//   "processType": "EMB",
//   "username": "admin",
//   "unitCode": "NORLANKA",
//   "companyCode": "NORLANKA"
// }

export class SPS_C_ProdColorEligibleBundlesForMoveToInvRequest extends CommonRequestAttrs {
  procSerial: number;
  prodName: string;
  fgColor: string;
  processType: ProcessTypeEnum;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    procSerial: number,
    prodName: string,
    fgColor: string,
    processType: ProcessTypeEnum
  ) {
    super(username, unitCode, companyCode, userId);
    this.procSerial = procSerial;
    this.processType = processType;
    this.prodName = prodName;
    this.fgColor = fgColor;
  }
}

export class SPS_R_ProdColorEligibleBundlesForMoveToInvResponse extends GlobalResponseObject {
  data?: SPS_R_ProdColorEligibleBundlesForMoveToInvModel[];
  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: SPS_R_ProdColorEligibleBundlesForMoveToInvModel[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SPS_R_ProdColorEligibleBundlesForMoveToInvModel {
  pslId: number;
  bunBarcode: string;
  orgQty: number;
  opQty: number; //output qty for last operation under a processing type

  constructor(
    pslId: number,
    bunBarcode: string,
    orgQty: number,
    opQty: number
  ) {
    this.pslId = pslId;
    this.bunBarcode = bunBarcode;
    this.orgQty = orgQty;
    this.opQty = opQty;
  }
}


// {
//   "procSerial": 1,
//   "prodName": "Shirt-01",
//   "fgColor": "Navy Blue",
//   "processType": "EMB",
//   "username": "rajesh",
//   "movingBundles": [
//     {
//       "pslId": 542,
//       "bunBarcode": "30-CELFP-1-1",
//       "orgQty": 100,
//       "opQty": 100
//     },
//     {
//       "pslId": 542,
//       "bunBarcode": "30-CELFP-10-1",
//       "orgQty": 100,
//       "opQty": 100
//     }
//   ]
// }

export class SPS_C_ProdColorEligibleBundlesMovingToInvRequest extends CommonRequestAttrs {
  procSerial: number;
  prodName: string;
  fgColor: string;
  processType: ProcessTypeEnum;
  movingBundles: SPS_R_ProdColorEligibleBundlesForMoveToInvModel[];

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    procSerial: number,
    prodName: string,
    fgColor: string,
    processType: ProcessTypeEnum,
    movingBundles: SPS_R_ProdColorEligibleBundlesForMoveToInvModel[]
  ) {
    super(username, unitCode, companyCode, userId);
    this.procSerial = procSerial;
    this.processType = processType;
    this.prodName = prodName;
    this.fgColor = fgColor;
    this.movingBundles = movingBundles;
  }
}

// {
//     "confirmationId": 1,
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
// }

export class SPS_C_BundleInvConfirmationIdRequest extends CommonRequestAttrs {
  confirmationId: number;
  processType: ProcessTypeEnum;
  ackStatus?: SpsBundleInventoryMoveToInvStatusEnum;
  iNeedBundles?: boolean;
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    confirmationId: number,
    processType: ProcessTypeEnum,
    ackStatus?: SpsBundleInventoryMoveToInvStatusEnum,
    iNeedBundles?: boolean
  ) {
    super(username, unitCode, companyCode, userId);
    this.confirmationId = confirmationId;
    this.processType = processType;
    this.ackStatus = ackStatus;
    this.iNeedBundles = iNeedBundles;
  }
}


export class SPS_C_ProdColorInvConfirmationsRetrievalRequest extends CommonRequestAttrs {
  procSerial: number;
  prodName: string;
  fgColor: string;
  processType: ProcessTypeEnum;
  iNeedBundles: boolean;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    procSerial: number,
    prodName: string,
    fgColor: string,
    processType: ProcessTypeEnum,
    iNeedBundles: boolean
  ) {
    super(username, unitCode, companyCode, userId);
    this.procSerial = procSerial;
    this.processType = processType;
    this.prodName = prodName;
    this.fgColor = fgColor;
    this.iNeedBundles = iNeedBundles;
  }
}

export class SPS_R_MoveToInvConfirmationsResponse extends GlobalResponseObject {
  data?: SPS_R_MoveToInvConfirmationModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: SPS_R_MoveToInvConfirmationModel[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SPS_R_MoveToInvConfirmationModel {
  procSerial: number;
  procType: ProcessTypeEnum;
  fgColor: string;
  productName: string;
  id: number; // PK of the move to in request table
  confirmationId: string;
  createdOn: string; // date time
  createdBy: string; // person
  totalBundles: number;
  totalQty: number;
  closed: boolean;
  fgSku: string;
  movedToInv: SpsBundleInventoryMoveToInvStatusEnum;
  movedBundles: SPS_R_MoveToInvConfirmedBundleModel[];

  constructor(
    procSerial: number,
    procType: ProcessTypeEnum,
    fgColor: string,
    productName: string,
    id: number,
    confirmationId: string,
    createdOn: string,
    createdBy: string,
    totalBundles: number,
    totalQty: number,
    closed: boolean,
    fgSku: string,
    movedToInv: SpsBundleInventoryMoveToInvStatusEnum,
    movedBundles: SPS_R_MoveToInvConfirmedBundleModel[]
  ) {
    this.procSerial = procSerial;
    this.procType = procType;
    this.fgColor = fgColor;
    this.productName = productName;
    this.id = id;
    this.confirmationId = confirmationId;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    this.totalBundles = totalBundles;
    this.totalQty = totalQty;
    this.closed = closed;
    this.fgSku = fgSku;
    this.movedToInv = movedToInv;
    this.movedBundles = movedBundles;
  }
}



export class SPS_R_MoveToInvConfirmedBundleModel {
  pslId: number;
  bunBarcode: string;
  orgQty: number;
  opQty: number; //output qty for last operation under a processing type

  constructor(
    pslId: number,
    bunBarcode: string,
    orgQty: number,
    opQty: number
  ) {
    this.pslId = pslId;
    this.bunBarcode = bunBarcode;
    this.orgQty = orgQty;
    this.opQty = opQty;
  }
}


export class SPS_R_MoveToInvAllBundlesResponse extends GlobalResponseObject {
  data?: SPS_R_MoveToInvAllBundlesModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: SPS_R_MoveToInvAllBundlesModel[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SPS_R_MoveToInvAllBundlesModel {
  bunBarcode: string;
  qty: number;
  pslId: number;
  mToInv: boolean;

  constructor(
    bunBarcode: string,
    qty: number,
    pslId: number,
    mToInv: boolean
  ) {
    this.bunBarcode = bunBarcode;
    this.qty = qty;
    this.pslId = pslId;
    this.mToInv = mToInv;
  }
}
















































// {
//   "procSerial": 1,
//   "prodName": "Shirt-01",
//   "fgColor": "Navy Blue",
//   "processType": "EMB",
//   "username": "admin",
//   "iNeedJobQtys": true,
//   "iNeedInvMovedQty": true, 
//   "iNeedBundlesSummary": true,
//   "iNeedOrderQtys":true,
//   "unitCode": "NORLANKA",
//   "companyCode": "NORLANKA"
// }





export class SPS_C_ProdColorBundlesSummaryRequest extends CommonRequestAttrs {
  procSerial: number;
  prodName: string;
  fgColor: string;
  processType: ProcessTypeEnum;
  iNeedOrderQtys: boolean;
  iNeedJobQtys: boolean;
  iNeedInvMovedQty: boolean;
  iNeedBundlesSummary: boolean;
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    procSerial: number,
    prodName: string,
    fgColor: string,
    processType: ProcessTypeEnum,
    iNeedOrderQtys: boolean,
    iNeedJobQtys: boolean,
    iNeedInvMovedQty: boolean,
    iNeedBundlesSummary: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.procSerial = procSerial;
    this.processType = processType;
    this.prodName = prodName;
    this.fgColor = fgColor;
    this.iNeedOrderQtys = iNeedOrderQtys;
    this.iNeedJobQtys = iNeedJobQtys;
    this.iNeedInvMovedQty = iNeedInvMovedQty;
    this.iNeedBundlesSummary = iNeedBundlesSummary;
  }
}


export class SPS_R_MoveToInvProcSerialSummaryResponse extends GlobalResponseObject {
  data?: SPS_R_MoveToInvProcSerialSummaryModel;

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: SPS_R_MoveToInvProcSerialSummaryModel
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SPS_R_MoveToInvProcSerialSummaryModel {
  procSerial: number;
  procType: ProcessTypeEnum;
  prodName: string;
  fgColor: string;
  orderQtys: SPS_R_MoveToInvProcSerialOrderQtysModel[]; // make this as ref for displaying the grids in UI
  jobQtys: SPS_R_MoveToInvProcSerialJobQtysModel[];
  bundlesSummary: SPS_R_MoveToInvProcSerialBundleSummaryModel[];
  inventoryQtySummary: SPS_R_MoveToInvProcSerialInvMoveQtyModel[];

  constructor(
    procSerial: number,
    procType: ProcessTypeEnum,
    prodName: string,
    fgColor: string,
    orderQtys: SPS_R_MoveToInvProcSerialOrderQtysModel[],
    jobQtys: SPS_R_MoveToInvProcSerialJobQtysModel[],
    bundlesSummary: SPS_R_MoveToInvProcSerialBundleSummaryModel[],
    inventoryQtySummary: SPS_R_MoveToInvProcSerialInvMoveQtyModel[]
  ) {
    this.procSerial = procSerial;
    this.procType = procType;
    this.prodName = prodName;
    this.fgColor = fgColor;
    this.orderQtys = orderQtys;
    this.jobQtys = jobQtys;
    this.bundlesSummary = bundlesSummary;
    this.inventoryQtySummary = inventoryQtySummary;
  }
}

export class SPS_R_MoveToInvProcSerialOrderQtysModel {
  color: string;
  size: string;
  oQty: number;

  constructor(
    color: string,
    size: string,
    oQty: number
  ) {
    this.color = color;
    this.size = size;
    this.oQty = oQty;
  }
}

export class SPS_R_MoveToInvProcSerialJobQtysModel {
  color: string;
  size: string;
  jobQty: number;
  cancelledQty: number;
  reGenQty: number;

  constructor(
    color: string,
    size: string,
    jobQty: number,
    cancelledQty: number,
    reGenQty: number
  ) {
    this.color = color;
    this.size = size;
    this.jobQty = jobQty;
    this.cancelledQty = cancelledQty;
    this.reGenQty = reGenQty;
  }
}

export class SPS_R_MoveToInvProcSerialBundleSummaryModel {
  color: string;
  size: string;
  totalBundles: number;
  totalBundlesQty: number;
  totalInvMovedBundles: number;
  totalInvMovedBundlesQty: number;

  constructor(
    color: string,
    size: string,
    totalBundles: number,
    totalBundlesQty: number,
    totalInvMovedBundles: number,
    totalInvMovedBundlesQty: number
  ) {
    this.color = color;
    this.size = size;
    this.totalBundles = totalBundles;
    this.totalBundlesQty = totalBundlesQty;
    this.totalInvMovedBundles = totalInvMovedBundles;
    this.totalInvMovedBundlesQty = totalInvMovedBundlesQty;
  }
}

export class SPS_R_MoveToInvProcSerialInvMoveQtyModel {
  color: string;
  size: string;
  movedToInvQty: number;

  constructor(
    color: string,
    size: string,
    movedToInvQty: number
  ) {
    this.color = color;
    this.size = size;
    this.movedToInvQty = movedToInvQty;
  }
}

