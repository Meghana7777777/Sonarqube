import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { PoSizeQtysModel } from "../../../oq-update";

export class PoSizesModel {
    poLineId: number; // PK of the po line entity
    poSerial: number;
    productType: string;
    productName: string;
    sizeQtys: PoSizeQtysModel[];

    constructor(
        poLineId: number,
        poSerial: number,
        productType: string,
        productName: string,
        sizeQtys: PoSizeQtysModel[]
    ) {
        this.poLineId = poLineId;
        this.poSerial = poSerial;
        this.productType = productType;
        this.productName = productName;
        this.sizeQtys = sizeQtys;
    }
}