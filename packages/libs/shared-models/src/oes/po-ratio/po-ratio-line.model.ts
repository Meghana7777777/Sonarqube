
import { PoRatioFabricModel } from "./po-ratio-fabric.model";
import { PoRatioSizeModel } from "./po-ratio-size.model";

export class PoRatioLineModel {
    id: number;
    productType: string;
    productName: string;
    color: string;
    ratioPlies: number;
    ratioFabric: PoRatioFabricModel[];
    sizeRatios: PoRatioSizeModel[]; // if same ratio has more lines, then the size ratios will be the same for the whole ratio.
    components: string[];

    constructor(
        id: number,
        productType: string,
        productName: string,
        color: string,
        ratioPlies: number,
        ratioFabric: PoRatioFabricModel[],
        sizeRatios: PoRatioSizeModel[],
        components: string[]
    ) {
        this.id = id;
        this.productName = productName;
        this.productType = productType;
        this.color = color;
        this.ratioPlies = ratioPlies;
        this.ratioFabric = ratioFabric;
        this.sizeRatios = sizeRatios;
        this.components = components;
    }
}