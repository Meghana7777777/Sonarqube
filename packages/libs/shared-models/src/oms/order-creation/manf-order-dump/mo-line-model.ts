import { MoLineProductModel } from "./mo-line-product-model";

export class MoLineModel {
    moLineNumber: string;
    soNumber: string;
    soLineNumber: string;
    moLineProducts: MoLineProductModel[];

    constructor(
        moLineNumber: string,
        soNumber: string,
        soLineNumber: string,
        moLineProducts: MoLineProductModel[]
    ) {
        this.moLineNumber = moLineNumber;
        this.soNumber = soNumber;
        this.soLineNumber = soLineNumber;
        this.moLineProducts = moLineProducts;
    }
}
