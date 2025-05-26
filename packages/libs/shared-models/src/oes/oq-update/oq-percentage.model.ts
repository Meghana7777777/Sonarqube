import { OrderTypeEnum } from "../enum";

export class OqPercentageModel {
    oqType: OrderTypeEnum;
    perc: number;
    /**
     * 
     * @param oqType 
     * @param perc 
     */
    constructor(oqType: OrderTypeEnum, perc: number
    ) {
        this.oqType = oqType;
        this.perc = perc;
    }
}