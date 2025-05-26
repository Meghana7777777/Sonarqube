import { InsUomEnum } from "@xpparel/shared-models";

export class TrimRmModel {
    iCode: string;
    iName: string;
    uom: InsUomEnum;
    iDesc: string;
    gussetSep: string;
    purWidth: string;
    seq: number;
    mainFabric: boolean;
    components: string[];

    constructor(
        iCode: string,
        iName: string,
        uom: InsUomEnum,
        iDesc: string,
        gussetSep: string,
        purWidth: string,
        seq: number,
        mainFabric: boolean,
        components: string[]
    ) {
        this.iCode = iCode;
        this.iName = iName;
        this.uom = uom;
        this.iDesc = iDesc;
        this.gussetSep = gussetSep;
        this.purWidth = purWidth;
        this.seq = seq;
        this.mainFabric = mainFabric;
        this.components = components;
    }
}
