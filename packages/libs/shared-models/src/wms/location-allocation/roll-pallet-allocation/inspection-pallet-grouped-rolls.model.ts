import { InspectionLevelEnum } from "../../enum/inspection-level.enum";
import { RollInfoModel } from "../../packing-list";

export class InspectionPalletGroupedRollsModel {
    groupedBy: InspectionLevelEnum;
    groupedObjDesc: string;
    groupedObjNumber: string;
    rollsInfo: RollInfoModel[];

    constructor( groupedBy: InspectionLevelEnum, groupedObjDesc: string, groupedObjNumber: string, rollsInfo: RollInfoModel[]) {
        this.groupedBy = groupedBy;
        this.groupedObjDesc = groupedObjDesc;
        this.groupedObjNumber = groupedObjNumber;
        this.rollsInfo = rollsInfo;
    }
}

