import { CommonRequestAttrs } from "../common";
import { ProcessTypeEnum } from "../oms";

export class KC_KnitGroupPoSerialRequest extends CommonRequestAttrs {
    knitGroup: string;
    processingSerial: number;

    productCode: string; // Optional , if not needed in request please pass null
    fgColor: string; // Optional, if not needed in request please pass null
    processType: ProcessTypeEnum;

    iNeedSizesInfo: boolean;

    /**
     * Constructor for KnitGroupPoSerialRequest
     * @param username - User's name
     * @param unitCode - Code of the unit
     * @param companyCode - Code of the company
     * @param userId - User's unique identifier
     * @param date - Optional date
     * @param knitGroup - Knit group name
     * @param poSerial - Purchase order serial number
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitGroup: string,
        poSerial: number,
        productCode: string, // Optional , if not needed in request please pass null
        fgColor: string, // Optional, if not needed in request please pass null
        processType: ProcessTypeEnum,
        iNeedSizesInfo: boolean
    ) {
        super(username, unitCode, companyCode, userId); // Call parent constructor
        this.knitGroup = knitGroup;
        this.processingSerial = poSerial;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.processType = processType;
        this.iNeedSizesInfo = iNeedSizesInfo;
    }
}
