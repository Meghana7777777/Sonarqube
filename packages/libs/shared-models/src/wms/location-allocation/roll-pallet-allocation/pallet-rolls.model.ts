import { RollBasicInfoModel, RollInfoModel } from "../../packing-list";
export class PalletRollsModel {
    palletId: number; 
    palletCode: string;
    rollsInfo: RollBasicInfoModel[];

    constructor(palletId: number, palletCode: string, rollsInfo: RollBasicInfoModel[]) {
        this.palletCode = palletCode;
        this.palletId = palletId;
        this.rollsInfo = rollsInfo;
    }
}
