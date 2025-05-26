import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../enum";

export class MC_ProductSubLineProcessTypeRequest extends CommonRequestAttrs {
    moProductSubLineIds: number[];
    processType: ProcessTypeEnum;
    processingSerial?: number;

    /**
     * Constructor for MC_ProductSubLineProcessTypeRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code of the requester
     * @param companyCode - Company code of the requester
     * @param userId - User ID of the requester
     * @param moProductSubLineIds - Array of product sub-line IDs
     * @param processType - Process type enum value
     * @param date - Optional date parameter
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moProductSubLineIds: number[],
        processType: ProcessTypeEnum,
        processingSerial?: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.moProductSubLineIds = moProductSubLineIds;
        this.processType = processType;
        this.processingSerial = processingSerial;
    }
}
