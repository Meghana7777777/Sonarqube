// import { RmItemSubTypeEnum, RmItemTypeEnum } from "../../enum";

import { RmItemSubTypeEnum } from "../../enum/rm-item-sub-type.enum";
import { RmItemTypeEnum } from "../../enum/rm-item-type.enum";

// Birdge this with RawOrderSubLineRmModel using the iCode to get the item specific attrs
export class RawOrderLineRmModel {
    iCode: string;
    iDesc: string;
    iColor: string;
    iMaterial: string;
    iType: RmItemTypeEnum;
    iSubType: RmItemSubTypeEnum;
    consumption: number; // common consumption if any.. else will vary with size. refer the sub-line-rm-model
    wastage: number; // common wastage if any.. else will vary with size. refer the sub-line-rm-model
    fabricMeters : string;

    constructor(
        iCode: string,
        iDesc: string,
        iColor: string,
        iMaterial: string,
        iType: RmItemTypeEnum,
        iSubType: RmItemSubTypeEnum,
        consumption: number,
        wastage: number,
        fabricMeters : string,
    ) {
        this.iCode = iCode;
        this.iDesc = iDesc;
        this.iColor = iColor;
        this.iMaterial = iMaterial;
        this.iType = iType;
        this.iSubType = iSubType;
        this.consumption = consumption;
        this.wastage = wastage;
        this.fabricMeters = fabricMeters;
    }
}
