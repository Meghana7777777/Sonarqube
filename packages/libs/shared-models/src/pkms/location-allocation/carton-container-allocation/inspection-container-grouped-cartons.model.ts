import { InsInspectionLevelEnum } from "@xpparel/shared-models";
import { CartonInfoModel } from "../../carton-filling/carton-info.model";

export class InspectionContainerGroupedCartonsModel {
    groupedBy: InsInspectionLevelEnum;
    groupedObjDesc: string;
    groupedObjNumber: string;
    cartonsInfo: CartonInfoModel[];

    constructor( groupedBy:InsInspectionLevelEnum, groupedObjDesc: string, groupedObjNumber: string, cartonsInfo: CartonInfoModel[]) {
        this.groupedBy = groupedBy;
        this.groupedObjDesc = groupedObjDesc;
        this.groupedObjNumber = groupedObjNumber;
        this.cartonsInfo = cartonsInfo;
    }
}

