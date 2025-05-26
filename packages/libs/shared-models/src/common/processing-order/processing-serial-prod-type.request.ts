import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";

export class ProcessingSerialProdCodeRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    productCode: string;
    fgColor: string;

    iNeedSizesInfo: boolean;
    iNeedRmDetails : boolean;
    iNeedBarcodeDetails: boolean;
    iNeedJobFeatures: boolean;
  
    /**
     * Constructor for ProcessingSerialProdCodeRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User's ID
     * @param date - Request date (optional)
     * @param processingSerial - Processing serial number
     * @param productCode - Product code
     * @param fgColor - Finished goods color
     */
    constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      processingSerial: number,
      processType: ProcessTypeEnum,
      productCode: string,
      fgColor: string,
      iNeedSizesInfo: boolean,
      iNeedRmDetails : boolean,
      iNeedBarcodeDetails: boolean,
      iNeedJobFeatures: boolean
    ) {
      super(username, unitCode, companyCode, userId);
      this.processingSerial = processingSerial;
      this.processType = processType;
      this.productCode = productCode;
      this.fgColor = fgColor;
      this.iNeedSizesInfo = iNeedSizesInfo;
      this.iNeedRmDetails = iNeedRmDetails;
      this.iNeedBarcodeDetails = iNeedBarcodeDetails;
      this.iNeedJobFeatures = iNeedJobFeatures;
    }
  }
  