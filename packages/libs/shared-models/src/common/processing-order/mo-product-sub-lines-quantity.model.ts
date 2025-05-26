import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";

export class MoProductSubLineIdAndQtyRequest extends CommonRequestAttrs {
    moNumber: string;
    productSubLineInfo: ProductSubLineQtyModel[];
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
        productSubLineInfo: ProductSubLineQtyModel[],
        processType: ProcessTypeEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.productSubLineInfo = productSubLineInfo;
        this.processType = processType;
    }
}


export class ProductSubLineQtyModel {
    productSubLineId: number;
    quantity: number;

    /**
     * Constructor for ProductSubLineQtyModel
     * @param productSubLineId - ID of the product sub-line
     * @param quantity - Quantity associated with the product sub-line
     */
    constructor(productSubLineId: number, quantity: number) {
        this.productSubLineId = productSubLineId;
        this.quantity = quantity;
    }
}

