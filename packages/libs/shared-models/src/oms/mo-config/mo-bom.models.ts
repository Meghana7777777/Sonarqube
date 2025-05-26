import { BomItemTypeEnum, CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../common";
import { ProcessTypeEnum } from "../enum";

// BOM CREATION
export class MOC_MoBOMCreationRequest extends CommonRequestAttrs {
  moPk: number; // mandatory
  moNumber: string; // mandatory
  productCode: string;
  fgColor: string;
  styleCode: string;
  versionId: number;
  bomInfo: MOC_MoProcessTypesBomModel[];

  /**
   * Constructor for MOC_MoBOMCreationRequest
   * @param username - Username from CommonRequestAttrs
   * @param unitCode - Unit code from CommonRequestAttrs
   * @param companyCode - Company code from CommonRequestAttrs
   * @param userId - User ID from CommonRequestAttrs
   * @param date - Optional date from CommonRequestAttrs
   * @param moPk - Mandatory Manufacturing order primary key
   * @param moNumber - Mandatory Manufacturing order number
   * @param productCode - Product code
   * @param fgColor - Finished goods color
   * @param styleCode - Style code
   * @param versionId - Version ID
   * @param bomInfo - List of BOM information
   */
  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    moPk: number,
    moNumber: string,
    productCode: string,
    fgColor: string,
    styleCode: string,
    versionId: number,
    bomInfo: MOC_MoProcessTypesBomModel[]
  ) {
    super(username, unitCode, companyCode, userId);
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.productCode = productCode;
    this.fgColor = fgColor;
    this.styleCode = styleCode;
    this.versionId = versionId;
    this.bomInfo = bomInfo;
  }
}



export class MOC_MoProcessTypesBomModel {
  processType: ProcessTypeEnum;
  productCode: string;
  fgColor: string;
  subProcessBomInfo: MOC_MoSubProcessTypesBomModel[];

  /**
   * Constructor for MOC_MoProcessTypesBomModel
   * @param processType - Type of process
   * @param productCode - Name of the product
   * @param fgColor - Finished goods color
   * @param subProcessBomInfo - List of sub-process BOM information
   */
  constructor(
    processType: ProcessTypeEnum,
    productCode: string,
    fgColor: string,
    subProcessBomInfo: MOC_MoSubProcessTypesBomModel[]
  ) {
    this.processType = processType;
    this.productCode = productCode;
    this.fgColor = fgColor;
    this.subProcessBomInfo = subProcessBomInfo;
  }
}


export class MOC_MoSubProcessTypesBomModel {
  processType: ProcessTypeEnum;
  subProcessName: string;
  bomInfo: MOC_MoProcessTypeBomModel[];

  /**
   * Constructor for MOC_MoSubProcessTypesBomModel
   * @param processType - Type of process
   * @param subProcessName - Name of the sub-process
   * @param bomInfo - List of BOM information for the sub-process
   */
  constructor(
    processType: ProcessTypeEnum,
    subProcessName: string,
    bomInfo: MOC_MoProcessTypeBomModel[]
  ) {
    this.processType = processType;
    this.subProcessName = subProcessName;
    this.bomInfo = bomInfo;
  }
}


export class MOC_MoProcessTypeBomModel {
  itemCode: string;
  itemName: string; // not required in create
  itemDesc: string; // not required in create
  avgCons: number; // not required in create
  itemType: PhItemCategoryEnum; // not required in create
  bomItemType: BomItemTypeEnum;

  /**
   * Constructor for MOC_MoProcessTypeBomModel
   * @param itemCode - Code of the item (mandatory)
   * @param itemName - Name of the item (optional in create)
   * @param itemDesc - Description of the item (optional in create)
   * @param avgCons - Average consumption (optional in create)
   * @param itemType - Type of item (optional in create)
   */
  constructor(
    itemCode: string,
    itemName?: string,
    itemDesc?: string,
    avgCons?: number,
    itemType?: PhItemCategoryEnum,
    bomItemType ?: BomItemTypeEnum
  ) {
    this.itemCode = itemCode;
    this.itemName = itemName || "";
    this.itemDesc = itemDesc || "";
    this.avgCons = avgCons ?? 0;
    this.itemType = itemType!;
    this.bomItemType = bomItemType;
  }
}

export class MOC_MoBomModel {
  moPk: number;
  moNumber: string;
  bomInfo: MOC_MoProcessTypesBomModel[];

  /**
   * Constructor for MOC_MoBomModel
   * @param moPk - Primary key of the Manufacturing Order (mandatory)
   * @param moNumber - Manufacturing Order number (mandatory)
   * @param bomInfo - List of BOM process types (mandatory)
   */
  constructor(moPk: number, moNumber: string, bomInfo: MOC_MoProcessTypesBomModel[]) {
    this.moPk = moPk;
    this.moNumber = moNumber;
    this.bomInfo = bomInfo;
  }
}


export class MOC_MoBomModelResponse extends GlobalResponseObject {
  data?: MOC_MoBomModel;

  /**
   * Constructor for MOC_MoBomModelResponse
   * @param status - Response status
   * @param errorCode - Error code if any
   * @param internalMessage - Internal message for debugging
   * @param data - MOC_MoBomModel data (optional)
   */
  constructor(status: boolean, errorCode: number, internalMessage: string, data?: MOC_MoBomModel) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

// BOM CREATION END
