import { GlobalResponseObject } from "../../../common";
import { PoRatioSizeModel } from "../../../oes";
import { OpFormEnum } from "../../../oms";

export class PfEmbLinesPropsModel {
    docketNumbers: string[]; // Docket Number
    colors: string[];
    itemCodes: string[]; // optional
    itemDescs: string[]; // optional
    components: string[]; // optional
    docketPlies: number; // the docket plies
    refLayIds: number[];
    cutNumbers: number[];
    layNumbers: number[]; // the lay number under a doc
    refSizeProps: PoRatioSizeModel[];

    constructor(
        docketNumbers: string[], // Docket Number
        colors: string[],
        itemCodes: string[], // optional
        itemDescs: string[], // optional
        components: string[], // optional
        docketPlies: number, //  the docket plies
        refLayIds: number[],
        cutNumbers: number[],
        layNumbers: number[], // the lay number under a doc
        refSizeProps: PoRatioSizeModel[]
    ) {
        this.docketNumbers = docketNumbers;
        this.colors = colors;
        this.itemCodes = itemCodes;
        this.itemDescs = itemDescs;
        this.components = components;
        this.docketPlies = docketPlies;
        this.refLayIds = refLayIds;
        this.cutNumbers = cutNumbers;
        this.layNumbers = layNumbers;
        this.refSizeProps = refSizeProps;
    }
}