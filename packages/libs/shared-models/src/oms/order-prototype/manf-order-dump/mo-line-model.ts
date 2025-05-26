import { MoLineProductModel } from "./mo-line-product-model";

export class MoLineModel {
    moLineNumber: string;
    moLineProducts: MoLineProductModel[];

    constructor(
        moLineNumber: string,
        moLineProducts: MoLineProductModel[]
    ) {
        this.moLineNumber = moLineNumber;
        this.moLineProducts = moLineProducts;
    }
}
