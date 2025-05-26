import { OpVersionAbstractModel } from "./op-version-abstract.model";

export class StyleProductOpVersionAbstract {
    styleCode: string;
    productType: string;
    opVersionAbstract: OpVersionAbstractModel[];

    /**
     * Constructor for StyleProductOpVersionAbstract
     * @param styleCode - Style code
     * @param productType - Product type
     * @param opVersionAbstract - Array of OpVersionAbstractModel
     */
    constructor(styleCode: string, productType: string, opVersionAbstract: OpVersionAbstractModel[]) {
        this.styleCode = styleCode;
        this.productType = productType;
        this.opVersionAbstract = opVersionAbstract;
    }
}
