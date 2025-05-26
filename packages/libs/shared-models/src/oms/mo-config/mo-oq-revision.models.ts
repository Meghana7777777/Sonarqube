import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { OrderTypeEnum } from "../../oes";

export class MOC_MoOrderRevisionResponse extends GlobalResponseObject {
  data?: MOC_MoOrderRevisionModel;

  /**
   * Constructor for MOC_MoOrderRevisionResponse
   * @param status - Status of the response
   * @param errorCode - Error code if any
   * @param internalMessage - Internal message or description
   * @param data - Order revision model data (optional)
   */
  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: MOC_MoOrderRevisionModel
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}


export class MOC_MoOrderRevisionRequest extends CommonRequestAttrs {
  moPk: number;
  moNumber: string;
  moLineRevisions: MOC_MoLineOrderRevisionModel[];

  /**
   * Constructor for MOC_MoOrderRevisionRequest
   * @param username - Username
   * @param unitCode - Unit code
   * @param companyCode - Company code
   * @param userId - User ID
   * @param moPk - Manufacturing order primary key
   * @param moNumber - Manufacturing order number
   * @param moLineRevisions - List of Manufacturing order line revisions
   */
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moPk: number,
    moNumber: string,
    moLineRevisions: MOC_MoLineOrderRevisionModel[]
  ) {
    super(username, unitCode, companyCode, userId);
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.moLineRevisions = moLineRevisions;
  }
}


export class MOC_MoOrderRevisionModel {
  moPk: number;
  moNumber: string;
  isMoProceeded: boolean;
  moLineRevisions: MOC_MoLineOrderRevisionModel[];

  /**
   * Constructor for MOC_MoOrderRevisionModel
   * @param moPk - Manufacturing order primary key
   * @param moNumber - Manufacturing order number
   * @param isMoProceeded - Manufacturing order Proceeding Status
   * @param moLineRevisions - List of Manufacturing order line revisions
   */
  constructor(moPk: number, moNumber: string,isMoProceeded:boolean, moLineRevisions: MOC_MoLineOrderRevisionModel[]) {
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.isMoProceeded = isMoProceeded;
    this.moLineRevisions = moLineRevisions;
  }
}


export class MOC_MoLineOrderRevisionModel {
  moLineNumber: string;
  moLinePk: number;
  moNumber: string;
  productLevelRevisions: MOC_MoLineProductOrderRevisionModel[];

  /**
   * Constructor for MOC_MoLineOrderRevisionModel
   * @param moLineNumber - Manufacturing order line number
   * @param moLinePk - Manufacturing order line primary key
   * @param moNumber - Manufacturing order number
   * @param productLevelRevisions - List of product-level revisions for this Manufacturing order line
   */
  constructor(
    moLineNumber: string,
    moLinePk: number,
    moNumber: string,
    productLevelRevisions: MOC_MoLineProductOrderRevisionModel[]
  ) {
    this.moLineNumber = moLineNumber;
    this.moLinePk = moLinePk;
    this.moNumber = moNumber;
    this.productLevelRevisions = productLevelRevisions;
  }
}


export class MOC_MoLineProductOrderRevisionModel {
  styleCode: string;
  productCode: string;
  fgColor: string;
  oqTypeQtys: MOC_MoSubLineQtyModel[];

  /**
   * Constructor for MOC_MoLineProductOrderRevisionModel
   * @param styleCode - Style code of the product
   * @param productCode - Product code
   * @param fgColor - Finished goods color
   * @param oqTypeQtys - List of order quantity type details
   */
  constructor(
    styleCode: string,
    productCode: string,
    fgColor: string,
    oqTypeQtys: MOC_MoSubLineQtyModel[]
  ) {
    this.styleCode = styleCode;
    this.productCode = productCode;
    this.fgColor = fgColor;
    this.oqTypeQtys = oqTypeQtys;
  }
}

export class MOC_MoSubLineQtyModel {
  oqType: OrderTypeEnum;
  sizeQtys: {
    subLineId?: number; // PK of the order sub line, not required during creation
    size: string;
    qty: number;
  }[];

  /**
   * Constructor for MOC_MoSubLineQtyModel
   * @param oqType - Order quantity type
   * @param sizeQtys - Array of size and quantity details
   */
  constructor(
    oqType: OrderTypeEnum,
    sizeQtys: { subLineId?: number; size: string; qty: number }[]
  ) {
    this.oqType = oqType;
    this.sizeQtys = sizeQtys;
  }
}
