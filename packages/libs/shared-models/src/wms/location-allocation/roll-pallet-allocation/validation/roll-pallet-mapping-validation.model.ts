import { RollBasicInfoModel } from "../../../packing-list";

export class RollPalletMappingValidationModel {
    rollBasicInfo: RollBasicInfoModel[];

    incomingPalletId: number;
    incomingPalletCode: string;

    suggestedPalletId: number;
    suggestedPalletCode: string;

    totalPalletCapacity: number;
    currentConfirmedRollsInPallet: number;

    batchesInPallet: string[];

    constructor(rollBasicInfo: RollBasicInfoModel[], incomingPalletId: number, incomingPalletCode: string, suggestedPalletId: number, suggestedPalletCode: string, totalPalletCapacity: number, currentConfirmedRollsInPallet: number, batchesInPallet: string[]) {
        this.rollBasicInfo = rollBasicInfo;
        this.incomingPalletCode = incomingPalletCode;
        this.incomingPalletId = incomingPalletId;
        this.suggestedPalletCode = suggestedPalletCode;
        this.suggestedPalletId = suggestedPalletId;
        this.totalPalletCapacity = totalPalletCapacity;
        this.currentConfirmedRollsInPallet = currentConfirmedRollsInPallet;
        this.batchesInPallet = batchesInPallet;
    }
}

