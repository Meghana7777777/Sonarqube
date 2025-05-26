import { RollInfoUIModel } from "../../packing-list";
import { InspectionPalletGroupedRollsModel } from "./inspection-pallet-grouped-rolls.model";


export class PalletRollsUIModel {
    phId: number;
    palletId: number;
    palletCode: string;
    palletCapacity: number;
    pgName: string;
    noOfRolls: number;
    rollsInfo: RollInfoUIModel[];
}


export class BinPalletsUIModel {
    palletBarcode: string;
    palletId: number;
    palletCode: string;
    palletCapacity: number;
    pgName: string;
    noOfRolls: number;
}
