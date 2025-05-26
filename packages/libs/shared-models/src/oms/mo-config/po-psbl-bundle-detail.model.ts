import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../enum";
import { ProductSubLineAndBundleDetailModel } from "./pslb-bundle-detail.model";

export class MC_PoPslbBundleDetailModel extends CommonRequestAttrs {
    processingSerial: number;
    procType: ProcessTypeEnum;
    pslbBundleInfo: ProductSubLineAndBundleDetailModel[];

    /**
     * Constructor for MC_PoPslbBundleDetailModel
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID of the requester
     * @param date - Optional request date
     * @param processingSerial - Serial number for processing
     * @param procType - Process type enum
     * @param pslbBundleInfo - Array of ProductSubLineAndBundleDetailModel
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        procType: ProcessTypeEnum,
        pslbBundleInfo: ProductSubLineAndBundleDetailModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.procType = procType;
        this.pslbBundleInfo = pslbBundleInfo;
    }
}
