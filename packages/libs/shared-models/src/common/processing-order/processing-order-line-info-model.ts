import { ProcessTypeEnum } from "../../oms";
import { OrderFeatures } from "../order-features.model";
import { ProcessingOrderProductInfo } from "./processing-order-product-info.model";

export class ProcessingOrderLineInfo {
    moLineNumber: string;
    processingSerial: number;
    processType: ProcessTypeEnum;
    productInfo: ProcessingOrderProductInfo[];
    poLineFeatures: OrderFeatures[]; // ITS ONLY FOT GET API NOT REQUIRED WHILE CREATING

    /**
     * Constructor for PoLineInfo
     * @param moLineNumber - The manufacturing order line number
     * @param processingSerial - The manufacturing order serial number
     * @param productInfo - The product information list
     */
    constructor(moLineNumber: string, processingSerial: number,processType: ProcessTypeEnum, productInfo: ProcessingOrderProductInfo[], poLineFeatures: OrderFeatures[]) {
        this.moLineNumber = moLineNumber;
        this.processingSerial = processingSerial;
        this.productInfo = productInfo;
        this.poLineFeatures = poLineFeatures;
        this.processType = processType;
    }
}



