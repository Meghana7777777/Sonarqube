// DSETITEM Abstract
// The abstarct 
export class DSetSubItemAbstractModel {
    plantStyleRef: string;
    color: string;
    size: string;
    quantity: number;
    shade: string;
    bundles: number;
    constructor(
        plantStyleRef: string,
        color: string,
        size: string,
        quantity: number,
        shade: string,
        bundles: number
    ) {
        this.plantStyleRef = plantStyleRef
        this.color = color
        this.size = size
        this.quantity = quantity
        this.shade = shade
        this.bundles = bundles
    }
}