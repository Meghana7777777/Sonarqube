import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";

export class MoProductSubLineIdsRequest extends CommonRequestAttrs {
    moNumber: string;
    productSubLineIds: number[];
    processType: ProcessTypeEnum

    /**
     * Constructor for MoProductSubLineIdsRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param moNumber - Manufacturing order number
     * @param productSubLineIds - Array of product sub-line IDs
     * @param date - (Optional) Request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moNumber: string,
        productSubLineIds: number[],
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.productSubLineIds = productSubLineIds;
        this.processType = processType;
    }
}
