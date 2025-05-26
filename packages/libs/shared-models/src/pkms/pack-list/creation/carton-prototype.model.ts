import { PolyBagPrototypeModel } from "./polybag-prototype.model";

export class CartonPrototypeModel {
    cartonUniqueKey: string;
    itemId: number;
    boxMapId: number;
    itemCode: string;
    qty: number;
    noOfPBags: number;
    count: number;
    polyBags: PolyBagPrototypeModel[]
    constructor(
        cartonUniqueKey: string,
        itemId: number,
        boxMapId: number,
        itemCode: string,
        noOfPBags: number,
        count: number,
        polyBags: PolyBagPrototypeModel[]
    ) {
        this.cartonUniqueKey = cartonUniqueKey;
        this.itemId = itemId;
        this.boxMapId = boxMapId;
        this.itemCode = itemCode;
        this.noOfPBags = noOfPBags;
        this.count = count;
        this.polyBags = polyBags;
    }
}