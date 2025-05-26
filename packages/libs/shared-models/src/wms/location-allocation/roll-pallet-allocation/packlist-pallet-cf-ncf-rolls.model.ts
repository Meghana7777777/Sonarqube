import { RollInfoModel } from "../../packing-list";

export class PackListPalletCfNcfPfendingRollsModel {
   phId: number;
   phCode: string;
   pendingRollsForPalletConfirmation: RollInfoModel[];
   confrimedRollsForPallet: RollInfoModel[];

   constructor( phId: number, phCode: string, pendingRollsForPalletConfirmation: RollInfoModel[], confrimedRollsForPallet: RollInfoModel[]) {
    this.phId = phId;
    this.phCode = phCode;
    this.pendingRollsForPalletConfirmation = pendingRollsForPalletConfirmation;
    this.confrimedRollsForPallet = confrimedRollsForPallet;
   }
}
