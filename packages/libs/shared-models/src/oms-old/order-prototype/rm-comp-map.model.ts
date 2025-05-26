import { PhItemCategoryEnum } from "../../common";
import { ComponentModel } from "./components";

export class RmCompMapModel {
    iCode: string;
    iName: string; // not rquired in request
    iDesc: string; // not rquired in request
    iColor: string; // not rquired in request
    iMaterial: string; // not rquired in request
    iType: PhItemCategoryEnum; // not rquired in request
    iSubType: PhItemCategoryEnum; // not rquired in request
    sequence: number; // not rquired in request
    components: ComponentModel[];

    constructor(
        iCode: string,
        iName: string,
        iDesc: string,
        iColor: string,
        iMaterial: string,
        iType: PhItemCategoryEnum,
        iSubType: PhItemCategoryEnum, 
        sequence: number,
        components: ComponentModel[],
    ) {
        this.iCode = iCode;
        this.iName = iName;
        this.iDesc = iDesc;
        this.iColor = iColor;
        this.iMaterial = iMaterial;
        this.iType = iType;
        this.iSubType = iSubType;
        this.sequence = sequence;
        this.components = components;
    }
}


