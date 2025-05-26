import { PalletBinStatusEnum } from "../../enum";
import { CurrentPalletLocationEnum } from "../../enum/current-pallet-location.enum";
import { CurrentPalletStateEnum } from "../../enum/current-pallet-state.enum";
import { RollBasicInfoModel, RollInfoModel } from "../../packing-list";
import { InspectionPalletGroupedRollsModel } from "./inspection-pallet-grouped-rolls.model";


export class WarehousePalletRollsModel {
    phId: number; 
    pgName: string;
    palletId: number;
    palletCode: string;
    palletCapacity: number;
    uom: string;
    maxItems: number;
    palletCurrentLoc: CurrentPalletLocationEnum;
    palletCureentState: CurrentPalletStateEnum;
    status: PalletBinStatusEnum;
    totalMappedRolls: number;
    rollsInfo: RollInfoModel[];
    rollsBasicInfo: RollBasicInfoModel[];

    constructor(pgName: string, phId: number, palletId: number,palletCode: string, palletCapacity: number, uom: string, maxItems: number, palletCurrentLoc: CurrentPalletLocationEnum, palletCureentState: CurrentPalletStateEnum, status: PalletBinStatusEnum, totalMappedRolls: number, rollsInfo: RollInfoModel[], rollsBasicInfo: RollBasicInfoModel[]) {
        this.pgName = pgName;
        this.phId = phId;
        this.palletId = palletId;
        this.palletCode = palletCode;
        this.palletCapacity = palletCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.palletCurrentLoc = palletCurrentLoc;
        this.palletCureentState = palletCureentState;
        this.status = status;
        this.totalMappedRolls = totalMappedRolls;
        this.rollsInfo = rollsInfo;
        this.rollsBasicInfo = rollsBasicInfo;
    }
}
