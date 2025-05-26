import { CommonResponse } from "@xpparel/backend-utils";
import { BomItemTypeEnum, CommonRequestAttrs, GlobalResponseObject, OrderFeatures, PhItemCategoryEnum } from "../../common";
import { ProcessTypeEnum, MoConfigStatusEnum } from "../enum";
import { OqKeys, OrderTypeEnum } from "../../oes";

export class SI_ManufacturingOrderInfoAbstractResponse extends GlobalResponseObject {
  data?: SI_ManufacturingOrderInfoAbstractModel[];

  constructor(status: boolean, errorCode: number, internalMessage: string, data: SI_ManufacturingOrderInfoAbstractModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }

}

export class SI_ManufacturingOrderInfoResponse extends GlobalResponseObject {
  data?: SI_ManufacturingOrderInfoModel[];

  constructor(status: boolean, errorCode: number, internalMessage: string, data: SI_ManufacturingOrderInfoModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SI_ManufacturingOrderLineInfoResponse {
  data?: SI_MoLineInfoModel[];
}

// ALERT : This model returns the products under MO LINE LEVEL. Very less used
export class SI_MoLineProductInfoResponse {
  data?: SI_MoLineProductModel[];
}

// ALERT :Remember this models reqturns products under an MO LEVEL. Mostlu used
export class SI_ProductInfoResponse {
  data?: SI_MoProductModel[];
}

export class SI_MoProdSubLineInfoResponse {
  data?: SI_MoProdSubLineModel[];
}

export class SI_ManufacturingOrderInfoAbstractModel {
  moNumber: string;
  moPk: number;
  confirmed: number;
  style: string;

  constructor(
    moNumber: string,
    moPk: number,
    confirmed: number,
    style: string
  ) {
    this.moNumber = moNumber;
    this.moPk = moPk;
    this.confirmed = confirmed;
    this.style = style;
  }
}


export class SI_ManufacturingOrderInfoModel {
  moNumber: string;
  moPk: number;
  confirmed: boolean;
  configStatus: MoConfigStatusEnum;
  proceedingStatus: boolean;
  style: string;
  uploadedDate: string;
  moLineModel: SI_MoLineInfoModel[];
  moAtrs: SI_MoAttributesModel;
  moRm: SI_MoRmModel[];


  constructor(
    moNumber: string,
    moPk: number,
    confirmed: boolean,
    configStatus: MoConfigStatusEnum,
    proceedingStatus: boolean,
    style: string,
    uploadedDate: string,
    moLineModel: SI_MoLineInfoModel[],
    moAtrs: SI_MoAttributesModel,
    moRm: SI_MoRmModel[],
  ) {
    this.moNumber = moNumber;
    this.moPk = moPk;
    this.confirmed = confirmed;
    this.configStatus = configStatus;
    this.proceedingStatus = proceedingStatus;
    this.style = style
    this.uploadedDate = uploadedDate;
    this.moLineModel = moLineModel;
    this.moAtrs = moAtrs;
    this.moRm = moRm
  }
}

export class SI_MoAttributesModel {
  delDates: string[];
  destinations: string[];
  styles: string[];
  products: string[];
  co: string[];
  vpo: string[];


  constructor(
    delDates: string[],
    destinations: string[],
    styles: string[],
    products: string[],
    co: string[],
    vpo: string[],
  ) {
    this.delDates = delDates;
    this.destinations = destinations;
    this.styles = styles;
    this.products = products;
    this.co = co;
    this.vpo = vpo;
  }
}


export class SI_MoLineInfoModel {
  moLineNo: string;
  moLinePk: number;
  configStatus: MoConfigStatusEnum;
  moLineProducts: SI_MoLineProductModel[];
  moLineAttrs: SI_MoLineAttributesModel;
  customerName?: string;
  customerCode?: string;
  constructor(
    moLineNo: string,
    moLinePk: number,
    configStatus: MoConfigStatusEnum,
    moLineProducts: SI_MoLineProductModel[],
    moLineAttrs: SI_MoLineAttributesModel,
    customerName?: string,
    customerCode?: string
  ) {
    this.moLineNo = moLineNo;
    this.moLinePk = moLinePk;
    this.configStatus = configStatus;
    this.moLineProducts = moLineProducts;
    this.moLineAttrs = moLineAttrs;
    this.customerName = customerName;
    this.customerCode = customerCode;
  }
}

export class SI_MoLineAttributesModel {
  delDates: string[];
  destinations: string[];
  styles: string[];
  products: string[];
  co: string[];
  vpo: string[];

  constructor(
    delDates: string[],
    destinations: string[],
    styles: string[],
    products: string[],
    co: string[],
    vpo: string[],
  ) {
    this.delDates = delDates;
    this.destinations = destinations;
    this.styles = styles;
    this.products = products;
    this.co = co;
    this.vpo = vpo
  }
}

// ALERT: This is under MO + LINE + Product
export class SI_MoLineProductModel {
  moLine: string;
  moNumber: string;
  productName: string;
  fgColor: string;
  subLines: SI_MoProdSubLineModel[];
  rmInfo: SI_MoProductRmModel[];
  opInfo: SI_MoProductOpModel[];
  opRmInfo: SI_MoProductOpRmModel[];
  moLineProdcutAttrs: SI_MoLineProdAttributesModel;
  productCode: string;
  productType: string;

  constructor(
    moLine: string,
    moNumber: string,
    productName: string,
    fgColor: string,
    subLines: SI_MoProdSubLineModel[],
    rmInfo: SI_MoProductRmModel[],
    opInfo: SI_MoProductOpModel[],
    opRmInfo: SI_MoProductOpRmModel[],
    moLineProdcutAttrs: SI_MoLineProdAttributesModel,
    productCode: string,
    productType: string
  ) {
    this.moLine = moLine;
    this.moNumber = moNumber;
    this.productName = productName;
    this.fgColor = fgColor;
    this.subLines = subLines;
    this.rmInfo = rmInfo;
    this.opInfo = opInfo;
    this.opRmInfo = opRmInfo;
    this.moLineProdcutAttrs = moLineProdcutAttrs;
    this.productCode = productCode;
    this.productType = productType;
  }
}


// ALERT: This is under MO + Product
export class SI_MoProductModel {
  moNumber: string;
  productName: string;
  fgColor: string;
  subLines: SI_MoProdSubLineModel[];
  rmInfo: SI_MoProductRmModel[];
  opInfo: SI_MoProductOpModel[];
  opRmInfo: SI_MoProductOpRmModel[];
  moProdcutAttrs: SI_MoProdAttributesModel;

  constructor(
    moNumber: string,
    productName: string,
    fgColor: string,
    subLines: SI_MoProdSubLineModel[],
    rmInfo: SI_MoProductRmModel[],
    opInfo: SI_MoProductOpModel[],
    opRmInfo: SI_MoProductOpRmModel[],
    moProdcutAttrs: SI_MoProdAttributesModel
  ) {
    this.moNumber = moNumber;
    this.productName = productName;
    this.fgColor = fgColor;
    this.subLines = subLines;
    this.rmInfo = rmInfo;
    this.opInfo = opInfo;
    this.opRmInfo = opRmInfo;
    this.moProdcutAttrs = moProdcutAttrs;
  }
}


export class SI_MoProductRmModel {
  itemCode: string;
  itemDesc: string;
  avgCons: number;
  itemColor: string;
  seq: number; // sequence of the RM
  itemType: PhItemCategoryEnum;

  constructor(
    itemCode: string,
    itemDesc: string,
    avgCons: number,
    itemColor: string,
    seq: number,
    itemType: PhItemCategoryEnum
  ) {
    this.itemCode = itemCode;
    this.itemDesc = itemDesc;
    this.avgCons = avgCons;
    this.itemColor = itemColor;
    this.seq = seq;
    this.itemType = itemType;
  }
}


export class SI_MoRmModel {
  itemCode: string;
  itemDesc: string;
  avgCons: number;
  itemColor: string;
  seq: number; // sequence of the RM
  processType: ProcessTypeEnum;
  itemType: PhItemCategoryEnum;
  bomItemType: BomItemTypeEnum;

  constructor(
    itemCode: string,
    itemDesc: string,
    avgCons: number,
    itemColor: string,
    seq: number,
    processType: ProcessTypeEnum,
    itemType: PhItemCategoryEnum,
    bomItemType: BomItemTypeEnum,
  ) {
    this.itemCode = itemCode;
    this.itemDesc = itemDesc;
    this.avgCons = avgCons;
    this.itemColor = itemColor;
    this.seq = seq;
    this.processType = processType;
    this.itemType = itemType;
    this.bomItemType = bomItemType;
  }
}


export class SI_MoProductOpModel {
  opCode: string;
  processType: ProcessTypeEnum;
  opName: string;
  smv: number;

  constructor(
    opCode: string,
    processType: ProcessTypeEnum,
    opName: string,
    smv: number
  ) {
    this.opCode = opCode;
    this.processType = processType;
    this.opName = opName;
    this.smv = smv;
  }
}


export class SI_MoProductOpRmModel {
  opCode: string;
  processType: ProcessTypeEnum;
  bomInfo: SI_MoProductRmModel;

  constructor(
    opCode: string,
    processType: ProcessTypeEnum,
    bomInfo: SI_MoProductRmModel
  ) {
    this.opCode = opCode;
    this.processType = processType;
    this.bomInfo = bomInfo;
  }
}



export class SI_MoLineProdAttributesModel {
  delDates: string[];
  destinations: string[];
  styles: string[];
  products: string[];
  co: string[];
  vpo: string[];

  constructor(
    delDates: string[],
    destinations: string[],
    styles: string[],
    products: string[],
    co: string[],
    vpo: string[]
  ) {
    this.delDates = delDates;
    this.destinations = destinations;
    this.styles = styles;
    this.products = products;
    this.co = co;
    this.vpo = vpo;
  }
}


export class SI_MoProdAttributesModel {
  delDates: string[];
  destinations: string[];
  styles: string[];
  products: string[];
  co: string[];
  vpo: string[];

  constructor(
    delDates: string[],
    destinations: string[],
    styles: string[],
    products: string[],
    co: string[],
    vpo: string[]
  ) {
    this.delDates = delDates;
    this.destinations = destinations;
    this.styles = styles;
    this.products = products;
    this.co = co;
    this.vpo = vpo;
  }
}


export class SI_MoProdSubLineModel {
  color: string;
  size: string;
  qty: number;
  moProdSubLineAttrs: SI_MoProdSubLineAttr;
  pk: number; // pk of the order sub line
  moProdSubLineOrdFeatures?: OrderFeatures // returns while iNeedMoProdSubLineOrdFeatures is true
  oqType: OrderTypeEnum;

  constructor(
    color: string,
    size: string,
    qty: number,
    moProdSubLineAttrs: SI_MoProdSubLineAttr,
    pk: number,
    oqType: OrderTypeEnum,
    moProdSubLineOrdFeatures?: OrderFeatures,

  ) {
    this.color = color;
    this.size = size;
    this.qty = qty;
    this.moProdSubLineAttrs = moProdSubLineAttrs;
    this.pk = pk;
    this.oqType = oqType
    this.moProdSubLineOrdFeatures = moProdSubLineOrdFeatures
  }
}


export class SI_MoProdSubLineAttr {
  destination: string;
  delDate: string;
  vpo: string;
  prodName: string;
  co: string;
  style: string;
  color: string;
  size: string;
  qty: number;
  refNo: string;
  pcd: string;
  soNumber: string;
  soLineNumber: string;
  buyerPo: string;

  constructor(
    destination: string,
    delDate: string,
    vpo: string,
    prodName: string,
    co: string,
    style: string,
    color: string,
    size: string,
    qty: number,
    refNo: string,
    soNumber: string,
    soLineNumber: string,
    buyerPo:string
  ) {
    this.destination = destination;
    this.delDate = delDate;
    this.vpo = vpo;
    this.prodName = prodName;
    this.co = co;
    this.style = style;
    this.color = color;
    this.size = size;
    this.qty = qty;
    this.refNo = refNo;
    this.soNumber = soNumber;
    this.soLineNumber = soLineNumber
    this.buyerPo = buyerPo
  }
}

// {
//   "moNumber": "MO-203",
//   "companyCode": "NORLANKA",
//   "unitCode": "NORLANKA",
//   "username": "rajesh"
// }

export class SI_MoNumberRequest extends CommonRequestAttrs {   //
  moNumber: string; // u can pass this one or the moPk
  moPk: number; // u can pass this one or the moNumber

  iNeedMoAttrs: boolean;
  iNeedMoRm: boolean;
  iNeedMoLines: boolean;
  iNeedMoLineAttr: boolean;
  iNeedMoProd: boolean;
  iNeedProductRm: boolean;
  iNeedProductOps: boolean;
  iNeedProductOpRm: boolean;
  iNeedMoProdAttrs: boolean;
  iNeedMoSubLines: boolean;
  iNeedMoSubLineAttrs: boolean;

  productCode?: string;
  fgColor?: string;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moNumber: string,
    moPk: number,
    iNeedMoAttrs: boolean,
    iNeedMoRm: boolean,
    iNeedMoLines: boolean,
    iNeedMoLineAttr: boolean,
    iNeedMoProd: boolean,
    iNeedProductRm: boolean,
    iNeedProductOps: boolean,
    iNeedProductOpRm: boolean,
    iNeedMoProdAttrs: boolean,
    iNeedMoSubLines: boolean,
    iNeedMoSubLineAttrs: boolean,
    productCode?: string,
    fgColor?: string
  ) {
    super(username, unitCode, companyCode, userId);
    this.moNumber = moNumber;
    this.moPk = moPk;
    this.iNeedMoAttrs = iNeedMoAttrs;
    this.iNeedMoRm = iNeedMoRm;
    this.iNeedMoLines = iNeedMoLines;
    this.iNeedMoLineAttr = iNeedMoLineAttr;
    this.iNeedMoProd = iNeedMoProd;
    this.iNeedProductRm = iNeedProductRm;
    this.iNeedProductOps = iNeedProductOps;
    this.iNeedProductOpRm = iNeedProductOpRm;
    this.iNeedMoProdAttrs = iNeedMoProdAttrs;
    this.iNeedMoSubLines = iNeedMoSubLines;
    this.iNeedMoSubLineAttrs = iNeedMoSubLineAttrs;
    this.productCode = productCode;
    this.fgColor = fgColor;

  }
}

export class SI_MoLineIdRequest extends CommonRequestAttrs {
  moLinePk: number;
  moNumber: string; // u can pass this one or the moPk
  moPk: number; // u can pass this one or the moNumber

  iNeedMoLineAttr: boolean;
  iNeedMoProd: boolean;
  iNeedMoProdAttrs: boolean;
  iNeedProductRm: boolean;
  iNeedProductOps: boolean;
  iNeedProductOpRm: boolean;
  iNeedMoSubLines: boolean;
  iNeedMoSubLineAttrs: boolean;
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moLinePk: number,
    moNumber: string,
    moPk: number,
    iNeedMoLineAttr: boolean,
    iNeedMoProd: boolean,
    iNeedProductRm: boolean,
    iNeedProductOps: boolean,
    iNeedProductOpRm: boolean,
    iNeedMoProdAttrs: boolean,
    iNeedMoSubLines: boolean,
    iNeedMoSubLineAttrs: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.moLinePk = moLinePk;
    this.moNumber = moNumber;
    this.moPk = moPk;
    this.iNeedMoLineAttr = iNeedMoLineAttr;
    this.iNeedMoProd = iNeedMoProd;
    this.iNeedProductRm = iNeedProductRm;
    this.iNeedProductOps = iNeedProductOps;
    this.iNeedProductOpRm = iNeedProductOpRm;
    this.iNeedMoProdAttrs = iNeedMoProdAttrs;
    this.iNeedMoSubLines = iNeedMoSubLines;
    this.iNeedMoSubLineAttrs = iNeedMoSubLineAttrs;

  }
}

export class SI_MoProductIdRequest extends CommonRequestAttrs {
  moProductPk: number; // Pk of the order products
  moNumber: string; // u can pass this one or the moPk
  moPk: number; // u can pass this one or the moNumber

  iNeedMoProdAttrs: boolean;
  iNeedProductRm: boolean;
  iNeedProductOps: boolean;
  iNeedProductOpRm: boolean;
  iNeedMoSubLines: boolean;
  iNeedMoSubLineAttrs: boolean;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moProductPk: number,
    moNumber: string,
    moPk: number,
    iNeedProductRm: boolean,
    iNeedProductOps: boolean,
    iNeedProductOpRm: boolean,
    iNeedMoProdAttrs: boolean,
    iNeedMoSubLines: boolean,
    iNeedMoSubLineAttrs: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.moProductPk = moProductPk;
    this.moNumber = moNumber;
    this.moPk = moPk;
    this.iNeedProductRm = iNeedProductRm;
    this.iNeedProductOps = iNeedProductOps;
    this.iNeedProductOpRm = iNeedProductOpRm;
    this.iNeedMoProdAttrs = iNeedMoProdAttrs;
    this.iNeedMoSubLines = iNeedMoSubLines;
    this.iNeedMoSubLineAttrs = iNeedMoSubLineAttrs;

  }

}

export class SI_MoOrderSubLineIdsRequest extends CommonRequestAttrs {
  subLineInds: number[]; // PK of the order sub line ids
  iNeedMoProdSubLineAttrs: boolean;
}


export class SI_MoProductSubLineIdsRequest extends CommonRequestAttrs {
  moProductSubLinePk: number[]; // Pk of the product subline

  iNeedMoLines: boolean;
  iNeedMoLineAttr: boolean;
  iNeedMoProd: boolean;
  iNeedMoProdAttrs: boolean;
  iNeedMoSubLines: boolean;
  iNeedMoSubLineAttrs: boolean;
  iNeedMoProdSubLineOrdFeatures: boolean

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moProductSubLinePk: number[], // Pk of the product subline
    iNeedMoLines: boolean,
    iNeedMoLineAttr: boolean,
    iNeedMoProd: boolean,
    iNeedMoProdAttrs: boolean,
    iNeedMoSubLines: boolean,
    iNeedMoSubLineAttrs: boolean,
    iNeedMoProdSubLineOrdFeatures: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.moProductSubLinePk = moProductSubLinePk;
    this.iNeedMoLines = iNeedMoLines;
    this.iNeedMoLineAttr = iNeedMoLineAttr;
    this.iNeedMoProd = iNeedMoProd;
    this.iNeedMoProdAttrs = iNeedMoProdAttrs;
    this.iNeedMoSubLines = iNeedMoSubLines;
    this.iNeedMoSubLineAttrs = iNeedMoSubLineAttrs
    this.iNeedMoProdSubLineOrdFeatures = iNeedMoProdSubLineOrdFeatures;

  }
}


export class MOHeaderModelReqModel extends CommonRequestAttrs {
  monumber: string;
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    monumber: string,
  ) {
    super(username, unitCode, companyCode, userId);
    this.monumber = monumber;
  }
}

export class MOHeaderInfoModel {
  style: string;
  styleDesc: string;
  buyerPo: string;
  customerName: string;
  moLines: string[];
  profitCentreName: string;
  productTypes: string[];
  plantStyleRef: string;
  productCodes: string[];
  delDates: string[];
  destinations: string[];
  fgColors: string[];
  sizes: string[];
  soNumbers: string[];

  constructor(
    style: string,
    styleDesc: string,
    buyerPo: string,
    customerName: string,
    moLines: string[],
    profitCentreName: string,
    productTypes: string[],
    plantStyleRef: string,
    productCodes: string[],
    delDates: string[],
    destinations: string[],
    fgColors: string[],
    sizes: string[],
    soNumbers: string[]
  ) {
    this.style = style;
    this.styleDesc = styleDesc;
    this.buyerPo = buyerPo;
    this.customerName = customerName;
    this.moLines = moLines;
    this.profitCentreName = profitCentreName;
    this.productTypes = productTypes;
    this.plantStyleRef = plantStyleRef;
    this.productCodes = productCodes;
    this.delDates = delDates;
    this.destinations = destinations;
    this.fgColors = fgColors;
    this.sizes = sizes;
    this.soNumbers = soNumbers;
  }
}

export class MOHeaderInfoModelResponse extends GlobalResponseObject {
  data?: MOHeaderInfoModel[];
  constructor(status: boolean, errorCode: number, internalMessage: string, data: MOHeaderInfoModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}