import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../enum";

export class MOC_MoProdCodeProcTypeRequest extends CommonRequestAttrs {
  moPk: string;
  productName: string[];
  processType: ProcessTypeEnum[];
  fgColor?: string[];

  /**
   * Constructor for MOC_MoProdCodeProcTypeRequest
   * @param username - Username
   * @param unitCode - Unit code
   * @param companyCode - Company code
   * @param userId - User ID
   * @param moPk - Manufacturings order primary key
   * @param productName - List of product names
   * @param processType - List of process types
   * @param fgColor - Optional list of finished goods colors
   * @param date - Optional date
   */
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moPk: string,
    productName: string[],
    processType: ProcessTypeEnum[],
    fgColor?: string[]
  ) {
    super(username, unitCode, companyCode, userId);
    this.moPk = moPk;
    this.productName = productName;
    this.processType = processType;
    this.fgColor = fgColor;
  }
}


export class MOC_MoProdCodeRequest extends CommonRequestAttrs {
  moPk: string;
  moNumber: string;
  productCode: string;
  styleCode: string;
  fgColor?: string;

  /**
   * Constructor for MOC_MoProdCodeRequest
   * @param username - Username
   * @param unitCode - Unit code
   * @param companyCode - Company code
   * @param userId - User ID
   * @param moPk - Manufacturing order primary key
   * @param moNumber - Manufacturing order number
   * @param productCode - List of product codes
   * @param fgColor - Optional list of finished goods colors
   * @param date - Optional date
   */
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moPk: string,
    moNumber: string,
    productCode: string,
    styleCode: string,
    fgColor?: string
  ) {
    super(username, unitCode, companyCode, userId);
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.productCode = productCode;
    this.styleCode = styleCode;
    this.fgColor = fgColor;
  }
}



export class MOC_MoProductFabConsumptionRequest extends CommonRequestAttrs {
  moPk: string;
  moNumber: string;
  productCode: string;
  fgColor: string;
  styleCode: string;
  fabCons: MOC_MoProductFabSizeCons[]; // only required during the creation of consumption to the fabrics

  /**
   * Constructor for MOC_MoProductFabConsumptionRequest
   * @param username - Username from CommonRequestAttrs
   * @param unitCode - Unit code from CommonRequestAttrs
   * @param companyCode - Company code from CommonRequestAttrs
   * @param userId - User ID from CommonRequestAttrs
   * @param date - Optional date from CommonRequestAttrs
   * @param moPk - Manufacturing order primary key
   * @param moNumber - Manufacturing order number
   * @param productCode - Product code
   * @param fgColor - Finished goods color
   * @param fabCons - Fabric consumption details
   */
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moPk: string,
    moNumber: string,
    productCode: string,
    fgColor: string,
    fabCons: MOC_MoProductFabSizeCons[]
  ) {
    super(username, unitCode, companyCode, userId);
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.productCode = productCode;
    this.fgColor = fgColor;
    this.fabCons = fabCons;
  }
}


export class MOC_MoProductFabSizeCons {
  itemCode: string;
  component: string;
  sizeCons?: { 
    size: string; 
    cons: number; 
  }[]; // Optional array, not required to send if not saved

  /**
   * Constructor for MOC_MoProductFabSizeCons
   * @param itemCode - Item code
   * @param component - Component name
   * @param sizeCons - Optional array of size and consumption values
   */
  constructor(
    itemCode: string,
    component: string,
    sizeCons?: { size: string; cons: number }[]
  ) {
    this.itemCode = itemCode;
    this.component = component;
    this.sizeCons = sizeCons;
  }
}

export class MOC_MoProductFabConsumptionModel {
  moPk: string; // mandatory
  productCode: string; // mandatory
  fgColor: string; // mandatory
  fabCons: MOC_MoProductFabSizeCons[]; // mandatory
  sizesList: string[]; // mandatory

  /**
   * Constructor for MOC_MoProductFabConsumptionModel
   * @param moPk - Manufacturing order primary key (mandatory)
   * @param productCode - Product code (mandatory)
   * @param fgColor - Finished goods color (mandatory)
   * @param fabCons - Fabric consumption details (mandatory)
   * @param sizesList - List of available sizes (mandatory)
   */
  constructor(
    moPk: string,
    productCode: string,
    fgColor: string,
    fabCons: MOC_MoProductFabSizeCons[],
    sizesList: string[]
  ) {
    this.moPk = moPk;
    this.productCode = productCode;
    this.fgColor = fgColor;
    this.fabCons = fabCons;
    this.sizesList = sizesList;
  }
}


export class MOC_MoProductFabConsResponse extends GlobalResponseObject {
  data?: MOC_MoProductFabConsumptionModel[];

  /**
   * Constructor for MOC_MoProductFabConsResponse
   * @param status - Response status
   * @param errorCode - Error code
   * @param internalMessage - Internal message
   * @param data - Array of MOC_MoProductFabConsumptionModel (optional)
   */
  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: MOC_MoProductFabConsumptionModel[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}


