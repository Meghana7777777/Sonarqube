import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";
import { ProcessingOrderSubLineRequest } from "./processing-order-sub-line.request";

export class ProcessingOrderCreationRequest extends CommonRequestAttrs {
    prcOrdDescription: string;
    prcOrdRemarks : string
    processType: ProcessTypeEnum[];
    prcOrdSubLineInfo: ProcessingOrderSubLineRequest[];
    styleCode: string;
    routingGroup: string;

    /**
     * Constructor for MoCreationRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - ID of the user
     * @param prcOrdDescription - Description of the MO
     * @param prcOrdRemarks - Remarks of the MO
     * @param processType - Array of process types
     * @param prcOrdSubLineInfo - Array of MO sub-line requests
     * @param date - Optional date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        prcOrdDescription: string,
        prcOrdRemarks:string,
        processType: ProcessTypeEnum[],
        prcOrdSubLineInfo: ProcessingOrderSubLineRequest[],
        styleCode: string,
        routingGroup: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.prcOrdDescription = prcOrdDescription;
        this.processType = processType;
        this.prcOrdSubLineInfo = prcOrdSubLineInfo;
        this.styleCode = styleCode;
        this.prcOrdRemarks  = prcOrdRemarks
        this.routingGroup = routingGroup;
    }
}
