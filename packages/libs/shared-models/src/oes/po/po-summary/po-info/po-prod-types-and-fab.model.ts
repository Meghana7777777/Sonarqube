import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { CutRmModel } from "../../po-rm";

export class PoProdTypeAndFabModel {
    poSerial: number;
    productType: string;
    productName: string;
    color: string;
    iCodes: CutRmModel[];

    constructor(
        poSerial: number,
        productType: string,
        productName: string,
        color: string,
        iCodes: CutRmModel[]
    ) {
        this.poSerial = poSerial;
        this.productName = productName;
        this.productType = productType;
        this.color = color;
        this.iCodes = iCodes;
    }
}