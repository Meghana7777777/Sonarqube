
export class PoSizeQtysModel {
    size: string;
    originalQuantity: number;
    addQuantity: number;
    ratioQuantity: number;

    constructor(
        size: string,
        originalQuantity: number,
        addQuantity: number,
        ratioQuantity?: number
    ) {
        this.size = size;
        this.originalQuantity = originalQuantity;
        this.addQuantity = addQuantity;
        this.ratioQuantity = ratioQuantity;
    }
}