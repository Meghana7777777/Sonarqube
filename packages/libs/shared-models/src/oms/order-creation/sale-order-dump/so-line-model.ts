import { SoLineProductModel } from "./so-line-product-model";

export class SoLineModel {
    soLineNumber: string;
    soLineProducts: SoLineProductModel[];

    constructor(
        soLineNumber: string,
        soLineProducts: SoLineProductModel[]
    ) {
        this.soLineNumber = soLineNumber;
        this.soLineProducts = soLineProducts;
    }
}
