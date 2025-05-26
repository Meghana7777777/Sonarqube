import { PolyBagSizeRatio } from "./poly-bag-size-ratio.model";

export class PolyBagPrototypeModel {
    id: number;
    itemId: number;
    boxMapId: number;
    itemCode: string;
    qty: number;
    count: number;
    sizeRatios: PolyBagSizeRatio[];
    constructor(
        id: number,
        itemId: number,
        boxMapId: number,
        itemCode: string,
        qty: number,
        count: number,
        sizeRatios: PolyBagSizeRatio[]
    ) {
        this.id = id;
        this.itemId = itemId;
        this.boxMapId = boxMapId;
        this.itemCode = itemCode;
        this.qty = qty;
        this.count = count;
        this.sizeRatios = sizeRatios;
    }
}