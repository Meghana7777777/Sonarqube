import { GlobalResponseObject } from "../../../common";
import { PoRatioSizeModel } from "../../../oes";
import { OpFormEnum } from "../../../oms";

export class PfEmbLinePropsModel {
    docketNumber: string; // Docket Number
    docketGroup: string; // the docket group
    color: string;
    itemCode: string; // optional
    itemDesc: string; // optional
    components: string[]; // optional
    docketPlies: number; // the docket plies
    refLayId: number;
    cutNumber: number;
    cutSubNumber: number;
    layNumber: number; // the lay number under a doc
    layedPlies: number; // the layed plies
    refSizeProps: PoRatioSizeModel[];


    constructor(
        docketNumber: string, // Docket Number
        docketGroup: string,
        color: string,
        itemCode: string, // optional
        itemDesc: string, // optional
        components: string[], // optional
        docketPlies: number, //  the docket plies
        refLayId: number,
        cutNumber: number,
        cutSubNumber: number,
        layNumber: number, // the lay number under a doc
        layedPlies: number, // the layed plies
        refSizeProps: PoRatioSizeModel[]
    ) {
        this.docketNumber = docketNumber;
        this.docketGroup = docketGroup;
        this.color = color;
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.components = components;
        this.docketPlies = docketPlies;
        this.refLayId = refLayId;
        this.cutNumber = cutNumber;
        this.cutSubNumber = cutSubNumber;
        this.layNumber = layNumber;
        this.layedPlies = layedPlies;
        this.refSizeProps = refSizeProps;
    }
}