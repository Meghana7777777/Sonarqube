import { CommonRequestAttrs, GlobalResponseObject } from "../common";
import { ProcessTypeEnum } from "../oms";
export class KC_KnitRatioPoSerialRequest extends CommonRequestAttrs {
    knitRatioId: number;
    processingSerial: number;
    processType: ProcessTypeEnum;

    /**
     * Constructor for KC_KnitRatioPoSerialRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code of the request
     * @param companyCode - Company code of the request
     * @param userId - User ID of the requester
     * @param knitRatioId - ID of the knit ratio
     * @param processingSerial - Serial number of the processing
     * @param processType - Type of process (enum)
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitRatioId: number,
        processingSerial: number,
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.knitRatioId = knitRatioId;
        this.processingSerial = processingSerial;
        this.processType = processType;
    }
}
