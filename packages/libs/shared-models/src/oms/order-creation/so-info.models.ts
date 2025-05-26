import { CommonResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, GlobalResponseObject, OrderFeatures } from "../../common";
import { ProcessTypeEnum, SoConfigStatusEnum } from "../enum";

export class SI_SaleOrderInfoAbstractResponse extends GlobalResponseObject {
  data?: SI_SaleOrderInfoAbstractModel[];

  constructor(status: boolean, errorCode: number, internalMessage: string, data: SI_SaleOrderInfoAbstractModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }

}

export class SI_SaleOrderInfoResponse extends GlobalResponseObject {
  data?: SI_SaleOrderInfoModel[];

  constructor(status: boolean, errorCode: number, internalMessage: string, data: SI_SaleOrderInfoModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SI_SaleOrderLineInfoResponse {
  data?: SI_SoLineInfoModel[];
}

// ALERT : This model returns the products under SO LINE LEVEL. Very less used
export class SI_SoLineProductInfoResponse {
  data?: SI_SoLineProductModel[];
}

// ALERT :Remember this models reqturns products under an SO LEVEL. Mostlu used
export class SI_SOProductInfoResponse {
  data?: SI_SoProductModel[];
}

export class SI_SoProdSubLineInfoResponse {
  data?: SI_SoProdSubLineModel[];
}

export class SI_SaleOrderInfoAbstractModel {
  soNumber: string;
  soPk: number;
  confirmed: number;
  style: string;

  constructor(
    soNumber: string,
    soPk: number,
    confirmed: number,
    style: string
  ) {
    this.soNumber = soNumber;
    this.soPk = soPk;
    this.confirmed = confirmed;
    this.style = style;
  }
}


export class SI_SaleOrderInfoModel {
  soNumber: string;
  soPk: number;
  confirmed: boolean;
  configStatus: SoConfigStatusEnum;
  style: string;
  uploadedDate: string;
  soLineModel: SI_SoLineInfoModel[];
  soAtrs: SI_SoAttributesModel;


  constructor(
    soNumber: string,
    soPk: number,
    confirmed: boolean,
    configStatus: SoConfigStatusEnum,
    style: string,
    uploadedDate: string,
    soLineModel: SI_SoLineInfoModel[],
    soAtrs: SI_SoAttributesModel,
  ) {
    this.soNumber = soNumber;
    this.soPk = soPk;
    this.confirmed = confirmed;
    this.configStatus = configStatus;
    this.style = style
    this.uploadedDate = uploadedDate;
    this.soLineModel = soLineModel;
    this.soAtrs = soAtrs;
  }
}

export class SI_SoAttributesModel {
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


export class SI_SoLineInfoModel {
  soLineNo: string;
  soLinePk: number;
  configStatus: SoConfigStatusEnum;
  soLineProducts: SI_SoLineProductModel[];
  soLineAttrs: SI_SoLineAttributesModel;

  constructor(
    soLineNo: string,
    soLinePk: number,
    configStatus: SoConfigStatusEnum,
    soLineProducts: SI_SoLineProductModel[],
    soLineAttrs: SI_SoLineAttributesModel,
  ) {
    this.soLineNo = soLineNo;
    this.soLinePk = soLinePk;
    this.configStatus = configStatus;
    this.soLineProducts = soLineProducts;
    this.soLineAttrs = soLineAttrs
  }
}

export class SI_SoLineAttributesModel {
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

// ALERT: This is under SO + LINE + Product
export class SI_SoLineProductModel {
  soLine: string;
  soNumber: string;
  productName: string;
  fgColor: string;
  subLines: SI_SoProdSubLineModel[];
  soLineProdcutAttrs: SI_SoLineProdAttributesModel;

  constructor(
    soLine: string,
    soNumber: string,
    productName: string,
    fgColor: string,
    subLines: SI_SoProdSubLineModel[],
    soLineProdcutAttrs: SI_SoLineProdAttributesModel
  ) {
    this.soLine = soLine;
    this.soNumber = soNumber;
    this.productName = productName;

    this.fgColor = fgColor;
    this.subLines = subLines;
    this.soLineProdcutAttrs = soLineProdcutAttrs;
  }
}


// ALERT: This is under SO + Product
export class SI_SoProductModel {
  soNumber: string;
  productName: string;
  fgColor: string;
  subLines: SI_SoProdSubLineModel[];
  rmInfo: SI_SoProductRmModel[];
  opInfo: SI_SoProductOpModel[];
  opRmInfo: SI_SoProductOpRmModel[];
  soProdcutAttrs: SI_SoProdAttributesModel;

  constructor(
    soNumber: string,
    productName: string,
    productType: string,
    productCode: string,
    fgColor: string,
    subLines: SI_SoProdSubLineModel[],
    rmInfo: SI_SoProductRmModel[],
    opInfo: SI_SoProductOpModel[],
    opRmInfo: SI_SoProductOpRmModel[],
    soProdcutAttrs: SI_SoProdAttributesModel
  ) {
    this.soNumber = soNumber;
    this.productName = productName;
    this.fgColor = fgColor;
    this.subLines = subLines;
    this.rmInfo = rmInfo;
    this.opInfo = opInfo;
    this.opRmInfo = opRmInfo;
    this.soProdcutAttrs = soProdcutAttrs;
  }
}


export class SI_SoProductRmModel {
  itemCode: string;
  itemDesc: string;
  avgCons: number;
  itemColor: string;
  seq: number; // sequence of the RM

  constructor(
    itemCode: string,
    itemDesc: string,
    avgCons: number,
    itemColor: string,
    seq: number
  ) {
    this.itemCode = itemCode;
    this.itemDesc = itemDesc;
    this.avgCons = avgCons;
    this.itemColor = itemColor;
    this.seq = seq;
  }
}


export class SI_SoRmModel {
  itemCode: string;
  itemDesc: string;
  avgCons: number;
  itemColor: string;
  seq: number; // sequence of the RM
  processType: ProcessTypeEnum;

  constructor(
    itemCode: string,
    itemDesc: string,
    avgCons: number,
    itemColor: string,
    seq: number,
    processType: ProcessTypeEnum
  ) {
    this.itemCode = itemCode;
    this.itemDesc = itemDesc;
    this.avgCons = avgCons;
    this.itemColor = itemColor;
    this.seq = seq;
    this.processType = processType;
  }
}


export class SI_SoProductOpModel {
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


export class SI_SoProductOpRmModel {
  opCode: string;
  processType: ProcessTypeEnum;
  bomInfo: SI_SoProductRmModel;

  constructor(
    opCode: string,
    processType: ProcessTypeEnum,
    bomInfo: SI_SoProductRmModel
  ) {
    this.opCode = opCode;
    this.processType = processType;
    this.bomInfo = bomInfo;
  }
}



export class SI_SoLineProdAttributesModel {
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


export class SI_SoProdAttributesModel {
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


export class SI_SoProdSubLineModel {
  color: string;
  size: string;
  qty: number;
  soLine: string;
  soNumber: string;
  soProdSubLineAttrs: SI_SoProdSubLineAttr;
  pk: number; // pk of the order sub line
  soProdSubLineOrdFeatures?: OrderFeatures // returns while iNeedsoProdSubLineOrdFeatures is true

  constructor(
    color: string,
    size: string,
    qty: number,
    soProdSubLineAttrs: SI_SoProdSubLineAttr,
    pk: number,
    soProdSubLineOrdFeatures?: OrderFeatures
  ) {
    this.color = color;
    this.size = size;
    this.qty = qty;
    this.soProdSubLineAttrs = soProdSubLineAttrs;
    this.pk = pk;
    this.soProdSubLineOrdFeatures = soProdSubLineOrdFeatures
  }
}


export class SI_SoProdSubLineAttr {
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
    buyerPo: string,
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
    this.buyerPo = buyerPo;
  }
}



export class SI_SoNumberRequest extends CommonRequestAttrs {
  soNumber: string; // u can pass this one or the soPk
  soPk: number; // u can pass this one or the soNumber

  iNeedSoAttrs: boolean;
  iNeedSoLines: boolean;
  iNeedSoLineAttr: boolean;
  iNeedSoProd: boolean;
  iNeedSoProdAttrs: boolean;
  iNeedSoSubLines: boolean;
  iNeedSoSubLineAttrs: boolean;

  productCode?: string;
  fgColor?: string;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    soNumber: string,
    soPk: number,
    iNeedSoAttrs: boolean,
    iNeedSoLines: boolean,
    iNeedSoLineAttr: boolean,
    iNeedSoProd: boolean,
    iNeedSoProdAttrs: boolean,
    iNeedSoSubLines: boolean,
    iNeedSoSubLineAttrs: boolean,
    productCode ?: string,
    fgColor ?: string
  ) {
    super(username, unitCode, companyCode, userId);
    this.soNumber = soNumber;
    this.soPk = soPk;
    this.iNeedSoAttrs = iNeedSoAttrs;
    this.iNeedSoLines = iNeedSoLines;
    this.iNeedSoLineAttr = iNeedSoLineAttr;
    this.iNeedSoProd = iNeedSoProd;
    this.iNeedSoProdAttrs = iNeedSoProdAttrs;
    this.iNeedSoSubLines = iNeedSoSubLines;
    this.iNeedSoSubLineAttrs = iNeedSoSubLineAttrs;
    this.productCode = productCode;
    this.fgColor = fgColor;

  }
}

export class SI_SoLineIdRequest extends CommonRequestAttrs {
  soLinePk: number;
  soNumber: string; // u can pass this one or the soPk
  soPk: number; // u can pass this one or the soNumber

  iNeedSoLineAttr: boolean;
  iNeedSoProd: boolean;
  iNeedSoProdAttrs: boolean;
  iNeedProductRm: boolean;
  iNeedProductOps: boolean;
  iNeedProductOpRm: boolean;
  iNeedSoSubLines: boolean;
  iNeedSoSubLineAttrs: boolean;
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    soLinePk: number,
    soNumber: string,
    soPk: number,
    iNeedSoLineAttr: boolean,
    iNeedSoProd: boolean,
    iNeedProductRm: boolean,
    iNeedProductOps: boolean,
    iNeedProductOpRm: boolean,
    iNeedSoProdAttrs: boolean,
    iNeedSoSubLines: boolean,
    iNeedSoSubLineAttrs: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.soLinePk = soLinePk;
    this.soNumber = soNumber;
    this.soPk = soPk;
    this.iNeedSoLineAttr = iNeedSoLineAttr;
    this.iNeedSoProd = iNeedSoProd;
    this.iNeedProductRm = iNeedProductRm;
    this.iNeedProductOps = iNeedProductOps;
    this.iNeedProductOpRm = iNeedProductOpRm;
    this.iNeedSoProdAttrs = iNeedSoProdAttrs;
    this.iNeedSoSubLines = iNeedSoSubLines;
    this.iNeedSoSubLineAttrs = iNeedSoSubLineAttrs;

  }
}

export class SI_SoProductIdRequest extends CommonRequestAttrs {
  soProductPk: number; // Pk of the order products
  soNumber: string; // u can pass this one or the soPk
  soPk: number; // u can pass this one or the soNumber

  iNeedSoProdAttrs: boolean;
  iNeedProductRm: boolean;
  iNeedProductOps: boolean;
  iNeedProductOpRm: boolean;
  iNeedSoSubLines: boolean;
  iNeedSoSubLineAttrs: boolean;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    soProductPk: number,
    soNumber: string,
    soPk: number,
    iNeedProductRm: boolean,
    iNeedProductOps: boolean,
    iNeedProductOpRm: boolean,
    iNeedSoProdAttrs: boolean,
    iNeedSoSubLines: boolean,
    iNeedSoSubLineAttrs: boolean,
  ) {
    super(username, unitCode, companyCode, userId);
    this.soProductPk = soProductPk;
    this.soNumber = soNumber;
    this.soPk = soPk;
    this.iNeedProductRm = iNeedProductRm;
    this.iNeedProductOps = iNeedProductOps;
    this.iNeedProductOpRm = iNeedProductOpRm;
    this.iNeedSoProdAttrs = iNeedSoProdAttrs;
    this.iNeedSoSubLines = iNeedSoSubLines;
    this.iNeedSoSubLineAttrs = iNeedSoSubLineAttrs;

  }

}

export class SI_SoOrderSubLineIdsRequest extends CommonRequestAttrs {
  subLineInds: number[]; // PK of the order sub line ids
  iNeedsoProdSubLineAttrs: boolean;
}


export class SI_SoProductSubLineIdsRequest extends CommonRequestAttrs {
    soProductSubLinePk: number[]; // Pk of the product subline

    iNeedSoLines: boolean;
    iNeedSoLineAttr: boolean;
    iNeedSoProd: boolean;
    iNeedSoProdAttrs: boolean;
    iNeedSoSubLines: boolean;
    iNeedSoSubLineAttrs: boolean;
    iNeedsoProdSubLineOrdFeatures : boolean

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        soProductSubLinePk: number[], // Pk of the product subline
        iNeedSoLines: boolean,
        iNeedSoLineAttr: boolean,
        iNeedSoProd: boolean,
        iNeedSoProdAttrs: boolean,
        iNeedSoSubLines: boolean,
        iNeedSoSubLineAttrs: boolean,
        iNeedsoProdSubLineOrdFeatures: boolean,
    ) {
        super(username, unitCode, companyCode, userId);
        this.soProductSubLinePk = soProductSubLinePk;
        this.iNeedSoLines = iNeedSoLines;
        this.iNeedSoLineAttr = iNeedSoLineAttr;
        this.iNeedSoProd = iNeedSoProd;
        this.iNeedSoProdAttrs = iNeedSoProdAttrs;
        this.iNeedSoSubLines = iNeedSoSubLines;
        this.iNeedSoSubLineAttrs = iNeedSoSubLineAttrs
        this.iNeedsoProdSubLineOrdFeatures = iNeedsoProdSubLineOrdFeatures;

    }
}


export class SOHeaderInfoModel {
  style: string;
  styleDesc: string;
  buyerPo: string[];
  customerName: string;
  soLines: string[];
  profitCentreName: string;
  productTypes: string[];
  plantStyleRef: string;
  isSoConfirmed: boolean;

  constructor(data: {
    style: string;
    styleDesc: string;
    buyerPo: string[];
    customerName: string;
    soLines: string[];
    profitCentreName: string;
    productTypes: string[];
    plantStyleRef: string;
    isSoConfirmed: boolean;
  }) {
    this.style = data.style;
    this.styleDesc = data.styleDesc;
    this.buyerPo = data.buyerPo;
    this.customerName = data.customerName;
    this.soLines = data.soLines;
    this.profitCentreName = data.profitCentreName;
    this.productTypes = data.productTypes;
    this.plantStyleRef = data.plantStyleRef;
    this.isSoConfirmed = data.isSoConfirmed;
  }
}


export class SOHeaderInfoModelResponse extends GlobalResponseObject{
  data?:SOHeaderInfoModel[];
  constructor(status: boolean, errorCode: number, internalMessage: string, data: SOHeaderInfoModel[]) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

