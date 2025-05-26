import { InsUomEnum } from "@xpparel/shared-models";
import { CutRmSizePropsModel } from "./cut-rm-size-props.model";

export class CutRmModel {
    id: number; // PK of the po-cut-rm entity. Useful while during updates
    iCode: string;
    iName: string;
    iColor: string;
    uom: InsUomEnum;
    iDesc: string;
    gussetSep: string;
    purWidth: string;
    seq: number;
    mainFabric: boolean;
    fabCat: string;
    productName: string;
    fgColor: string;
    maxPlies: number;
    bindingConsumption: number; 
    isBinding: boolean;
    wastage: number;
    consumption: number;
    components: string[];
    refComponent: string;
    sizeWiseRmProps: CutRmSizePropsModel[];

    constructor(
        id: number,
        iCode: string,
        iName: string,
        iColor: string,
        uom: InsUomEnum,
        iDesc: string,
        gussetSep: string,
        purWidth: string,
        seq: number,
        mainFabric: boolean,
        fabCat: string,
        productName: string,
        fgColor: string,
        maxPlies: number,
        bindingConsumption: number,
        isBinding: boolean,
        wastage: number,
        consumption: number,
        components: string[],
        refComponent: string,
        sizeWiseRmProps: CutRmSizePropsModel[]
    ) {
        this.id = id;
        this.iCode = iCode;
        this.iName = iName;
        this.iColor = iColor;
        this.uom = uom;
        this.iDesc = iDesc;
        this.gussetSep = gussetSep;
        this.purWidth = purWidth;
        this.seq = seq;
        this.mainFabric = mainFabric;
        this.fabCat = fabCat;
        this.productName = productName;
        this.fgColor = fgColor;
        this.maxPlies = maxPlies;
        this.bindingConsumption = bindingConsumption;
        this.isBinding = isBinding;
        this.wastage = wastage;
        this.consumption = consumption;
        this.components = components;
        this.refComponent = refComponent;
        this.sizeWiseRmProps = sizeWiseRmProps;
    }
}
