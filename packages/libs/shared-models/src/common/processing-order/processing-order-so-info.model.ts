import { OrderFeatures } from "../order-features.model";
import { ProcessingOrderLineInfo } from "./processing-order-line-info-model";

export class ProcessingOrderMoInfoModel {
    moNumber: string; // Manufacturing Order Number
    prcOrdLineInfo: ProcessingOrderLineInfo[];
    prcOrdMoFeatures: OrderFeatures[];
    /**
     * Constructor for POMoInfoModel
     * @param moNumber - Manufacturing Order Number
     */
    constructor(moNumber: string, prcOrdLineInfo: ProcessingOrderLineInfo[], prcOrdMoFeatures: OrderFeatures[]) {
        this.moNumber = moNumber;
        this.prcOrdLineInfo = prcOrdLineInfo;
        this.prcOrdMoFeatures = prcOrdMoFeatures;
    }
}
