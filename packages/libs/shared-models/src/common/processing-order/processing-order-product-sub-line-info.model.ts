import { OrderTypeEnum } from "../../oes";
import { OrderFeatures } from "../order-features.model";

export class ProcessingOrderProductSubLineInfo {
    productSubLineId: number;
    fgColor: string;
    size: string;
    quantity: number;
    prcOrdSubLineFeatures: OrderFeatures[]; // ITS ONLY FOT GET API NOT REQUIRED WHILE CREATING

    /**
     * Constructor for MOProductSubLineInfo
     * @param productSubLineId - The ID of the product sub-line
     * @param fgColor - The finished goods color
     * @param size - The size of the product
     * @param quantity - The quantity of the product
     */
    constructor(productSubLineId: number, fgColor: string, size: string, quantity: number,prcOrdSubLineFeatures: OrderFeatures[]) {
        this.productSubLineId = productSubLineId;
        this.fgColor = fgColor;
        this.size = size;
        this.quantity = quantity;
        this.prcOrdSubLineFeatures = prcOrdSubLineFeatures;

    }
}




