import { ProcessTypeEnum } from "../../oms";
import { OrderFeatures } from "../order-features.model";
import { ProcessingOrderMoInfoModel } from "./processing-order-so-info.model";


// MO -> MO LINE -> PRODUCT -> SUB LINE(FEATURES)
// I NEED MO SUB LINE FEATURES 
// I NEED PRODUCT FEATURES 
// I NEED MO LINE FEATURES
// I NEED MO FEATURES
export class ProcessingOrderInfoModel {
    processingSerial: number; // NOT REQUIRED DURING CREATION
    prcOrdDescription: string;
    styleCode: string;
    processType: ProcessTypeEnum; // Should be ProcessTypeEnum
    prcOrdMoInfo: ProcessingOrderMoInfoModel[];
    prcOrdFeatures: OrderFeatures[];
    
    /**
     * Constructor for MOInfoModel
     * @param processingSerial - Manufacturing Order Serial (NOT REQUIRED DURING CREATION)
     * @param prcOrdDescription - Description of the Manufacturing Order
     * @param prcOrdMoInfo - Manufacturing Order Information
     * @param styleCode - Style Code
     * @param processType - Process Type Enum
     * @param prcOrdProductFeatures - Product Features
     * @param prcOrdLineFeatures - Line Features
     * @param prcOrdSubLineFeatures - Sub-Line Features
     * @param prcOrdFeatures - Additional Features
     */
    constructor(
        processingSerial: number,
        prcOrdDescription: string,
        prcOrdMoInfo: ProcessingOrderMoInfoModel[],
        styleCode: string,
        processType: ProcessTypeEnum,
        prcOrdFeatures: OrderFeatures[]
    ) {
        this.processingSerial = processingSerial;
        this.prcOrdDescription = prcOrdDescription;
        this.prcOrdMoInfo = prcOrdMoInfo;
        this.styleCode = styleCode;
        this.processType = processType;
        this.prcOrdFeatures = prcOrdFeatures;
    }
}
