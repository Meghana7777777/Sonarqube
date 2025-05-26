import { WarehousePalletRollsModel } from "../roll-pallet-allocation/warehouse-pallet-rolls.model";


export class BinPalletModel {
    binId: number;
    binCode: string;
    binDesc: string;
    totalSupportedPallets: number;
    totalFilledPallets: number;
    emptyPallets: number;
    palletsInfo: WarehousePalletRollsModel[];

    constructor( binId: number, binCode: string, binDesc: string, totalSupportedPallets: number, totalFilledPallets: number, emptyPallets: number, palletsInfo: WarehousePalletRollsModel[]) {
        this.binId = binId;
        this.binCode = binCode;
        this.binDesc = binDesc;
        this.totalSupportedPallets = totalSupportedPallets;
        this.totalFilledPallets = totalFilledPallets;
        this.emptyPallets = emptyPallets;
        this.palletsInfo = palletsInfo;
    }
}