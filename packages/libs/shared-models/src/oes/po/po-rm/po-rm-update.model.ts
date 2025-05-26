
import { InsUomEnum } from "@xpparel/shared-models";
import { CutRmSizePropsModel } from "./cut-rm-size-props.model";

export class PoRmUpdateModel {
    poMaterialId: number; // must be put in the request
    poSerial: number;// must be put in the request
    productType: string;// not required in request
    productName: string;// not required in request
    fgColor: string; // not required in request
    poMaterialPk: number; // optional 
    iCode: string;// not required in request
    itemDesc: string;// not required in request
    itemName: string; // not required in request
    maxPlies: number; // input
    consumption: number; // input
    wastage: number; // input
    mainFabric: boolean; // input
    bindingConsumption: number; 
    isBinding: boolean;
    uom: InsUomEnum;

    sizeProps: CutRmSizePropsModel[]; // to capture the size wise props

    constructor(
        poMaterialId: number,
        poSerial: number,
        productType: string,
        productName: string,
        fgColor: string,
        poMaterialPk: number,
        iCode: string,
        itemDesc: string,
        itemName: string,
        maxPlies: number,
        consumption: number,
        wastage: number,
        mainFabric: boolean,
        bindingConsumption: number,
        isBinding: boolean,
        uom: InsUomEnum,
        sizeProps: CutRmSizePropsModel[],
    ) {
        this.poMaterialId = poMaterialId;
        this.poSerial = poSerial;
        this.productType = productType;
        this.productName = productName;
        this.fgColor = fgColor;
        this.poMaterialPk = poMaterialPk;
        this.iCode = iCode;
        this.itemDesc = itemDesc;
        this.itemName = itemName;
        this.maxPlies = maxPlies;
        this.consumption = consumption;
        this.wastage = wastage;
        this.mainFabric = mainFabric;
        this.bindingConsumption = bindingConsumption;
        this.isBinding = isBinding;
        this.uom = uom;
        this.sizeProps = sizeProps;

    }
}