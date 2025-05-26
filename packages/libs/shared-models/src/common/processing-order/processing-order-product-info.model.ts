import { OrderFeatures } from "../order-features.model";
import { ProcessingOrderProductSubLineInfo } from "./processing-order-product-sub-line-info.model";

export class ProcessingOrderProductInfo {
    productCode: string;
    productType: string;
    productName: string;
    prcOrdProductFeatures: OrderFeatures[]; // ITS ONLY FOT GET API NOT REQUIRED WHILE CREATING
    prcOrdSubLineInfo: ProcessingOrderProductSubLineInfo[];

    /**
     * Constructor for MOProductInfo
     * @param productCode - The code of the product
     * @param productType - The type of the product
     * @param productName - The name of the product
     * @param prcOrdSubLineInfo - The sub-line information of the product
     */
    constructor(productCode: string, productType: string, productName: string, prcOrdSubLineInfo: ProcessingOrderProductSubLineInfo[], prcOrdProductFeatures: OrderFeatures[]) {
        this.productCode = productCode;
        this.productType = productType;
        this.productName = productName;
        this.prcOrdSubLineInfo = prcOrdSubLineInfo;
        this.prcOrdProductFeatures = prcOrdProductFeatures;
    }
}


