import { MoProductSubLineModel } from "./mo-product-sub-line-model";

export class MoLineProductModel {
    productCode: string;
    productType: string;
    productName: string;
    sequence: number;
    moProductSubLines: MoProductSubLineModel[];

    constructor(
        productCode: string,
        productType: string,
        productName: string,
        sequence: number,
        moProductSubLines: MoProductSubLineModel[]

    ) {
        this.productCode = productCode;
        this.productType = productType;
        this.productName = productName;
        this.sequence = sequence;
        this.moProductSubLines = moProductSubLines;

    }
}
