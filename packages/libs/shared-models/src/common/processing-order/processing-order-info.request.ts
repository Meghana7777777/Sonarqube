import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model";

// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "iNeedMoSubLines": true,
//     "processingSerial": 1,
//     "processType": "SEW",
//     "iNeedPrcOrdLineInfo": true,
//     "iNeedPrcOrdProductInfo": true,
//     "iNeedPrcOrdSubLineInfo": true
// }

export class ProcessingOrderInfoRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    iNeedPrcOrdFeatures: boolean;

    iNeedPrcOrdMoInfo: boolean;
    iNeedPrcOrdMoFeatures: boolean;

    iNeedPrcOrdLineInfo: boolean;
    iNeedPrcOrdLineFeatures: boolean;

    iNeedPrcOrdProductInfo: boolean;
    iNeedPrcOrdProductFeatures: boolean;

    iNeedPrcOrdSubLineInfo: boolean;
    iNeedPrcOrdSubLineFeatures: boolean;

    /**
     * Constructor for PrcOrdInfoRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param processingSerial - Processing Order Serial
     * @param iNeedPrcOrdFeatures - Whether PrcOrd Features are needed
     * @param iNeedPrcOrdMoInfo - Whether PrcOrd MO Info is needed
     * @param iNeedPrcOrdMoFeatures - Whether PrcOrd MO Features are needed
     * @param iNeedPrcOrdLineInfo - Whether PrcOrd Line Info is needed
     * @param iNeedPrcOrdLineFeatures - Whether PrcOrd Line Features are needed
     * @param iNeedPrcOrdProductInfo - Whether PrcOrd Product Info is needed
     * @param iNeedPrcOrdProductFeatures - Whether PrcOrd Product Features are needed
     * @param iNeedPrcOrdSubLineInfo - Whether PrcOrd Sub-Line Info is needed
     * @param iNeedPrcOrdSubLineFeatures - Whether PrcOrd Sub-Line Features are needed
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        processType: ProcessTypeEnum,
        iNeedPrcOrdFeatures: boolean,
        iNeedPrcOrdMoInfo: boolean,
        iNeedPrcOrdMoFeatures: boolean,
        iNeedPrcOrdLineInfo: boolean,
        iNeedPrcOrdLineFeatures: boolean,
        iNeedPrcOrdProductInfo: boolean,
        iNeedPrcOrdProductFeatures: boolean,
        iNeedPrcOrdSubLineInfo: boolean,
        iNeedPrcOrdSubLineFeatures: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.iNeedPrcOrdFeatures = iNeedPrcOrdFeatures;
        this.iNeedPrcOrdMoInfo = iNeedPrcOrdMoInfo;
        this.iNeedPrcOrdMoFeatures = iNeedPrcOrdMoFeatures;
        this.iNeedPrcOrdLineInfo = iNeedPrcOrdLineInfo;
        this.iNeedPrcOrdLineFeatures = iNeedPrcOrdLineFeatures;
        this.iNeedPrcOrdProductInfo = iNeedPrcOrdProductInfo;
        this.iNeedPrcOrdProductFeatures = iNeedPrcOrdProductFeatures;
        this.iNeedPrcOrdSubLineInfo = iNeedPrcOrdSubLineInfo;
        this.iNeedPrcOrdSubLineFeatures = iNeedPrcOrdSubLineFeatures;
    }
}
