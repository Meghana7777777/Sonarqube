import { SoProductSubLineModel } from "./so-product-sub-line-model";

export class SoLineProductModel {
    productCode: string;
    productType: string;
    productName: string;
    sequence: number;
    soProductSubLines: SoProductSubLineModel[];

    constructor(
        productCode: string,
        productType: string,
        productName: string,
        sequence: number,
        soProductSubLines: SoProductSubLineModel[]

    ) {
        this.productCode = productCode;
        this.productType = productType;
        this.productName = productName;
        this.sequence = sequence;
        this.soProductSubLines = soProductSubLines;

    }
}
