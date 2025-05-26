import { PalletBinStatusEnum, PalletGroupTypeEnum } from "../../enum";
import { CurrentPalletLocationEnum } from "../../enum/current-pallet-location.enum";
import { CurrentPalletStateEnum } from "../../enum/current-pallet-state.enum";
import { RollInfoModel } from "../../packing-list";
import { InspectionPalletGroupedRollsModel } from "./inspection-pallet-grouped-rolls.model";


export class PgRollsModel {
    pgId: number; 
    pgName: string;
    pgType: PalletGroupTypeEnum; 
    rollsInfo: RollInfoModel[];
    packListId: number;

    constructor(pgName: string, pgId: number, pgType: PalletGroupTypeEnum, packListId: number, rollsInfo: RollInfoModel[]) {
        this.pgName = pgName;
        this.pgId = pgId;
        this.pgType = pgType;
        this.packListId = packListId;
        this.rollsInfo = rollsInfo;
    }
}
