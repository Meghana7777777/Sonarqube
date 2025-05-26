import { BinModel } from "../../dashboard";
import { TrayModel, TrollyModel } from "../../masters";
import { PalletDetailsModel } from "../roll-pallet-allocation";

export class RollLocationModel {
    rollId: string;
    barcode: string;

    trayInfo ?: TrayModel;
    palletInfo ?: PalletDetailsModel
    trolleyInfo ?: TrollyModel;
    binInfo ?: BinModel;

    constructor(rollId: string, barcode: string, trayInfo ?: TrayModel, palletInfo ?: PalletDetailsModel, trolleyInfo ?: TrollyModel, binInfo ?: BinModel) {
        this.rollId = rollId;
        this.barcode = barcode;
        this.trayInfo = trayInfo;
        this.palletInfo = palletInfo;
        this.trolleyInfo = trolleyInfo;
        this.binInfo = binInfo;
    }
}