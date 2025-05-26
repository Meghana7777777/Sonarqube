import { PLSubLineQtyModel } from "./pl-sub-line-qty.model";

export class PlLineInfo {
    lineId: number;
    line: string;
    subLineQuantities: PLSubLineQtyModel[];
    productRef: string;
    productCode: string;
    productName: string;
    productType: string;
    fgColor: string;
    /**
     * @param lineId:pkId of color in pre-Integration
     * @param line : string  
     * @param subLineQuantities size wise Quantities and pack list generated
     * @param productRef
     * @param productName
     * @param fgColor
     */
    constructor(lineId: number, line: string, subLineQuantities: PLSubLineQtyModel[], productRef: string,
        productName: string,productType: string,productCode: string,fgColor: string) {
        this.lineId = lineId;
        this.line = line;
        this.subLineQuantities = subLineQuantities;
        this.productName = productName;
        this.productRef = productRef;
        this.productType = productType;
        
		this.productCode = productCode;
        this.fgColor = fgColor;
    }
}