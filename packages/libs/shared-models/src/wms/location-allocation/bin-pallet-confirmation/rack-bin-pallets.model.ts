import { BinPalletModel } from "./bin-pallet.model";

export class RackBinPalletsModel {
    rackId: number;
    rackCode: string;
    rackDesc: string;
    totalBins: number;
    binInfo: BinPalletModel[];

    constructor( rackId: number, rackCode: string, rackDesc: string, totalBins: number, binInfo: BinPalletModel[]) {
        this.rackId = rackId;
        this.rackCode = rackCode;
        this.rackDesc = rackDesc;
        this.totalBins = totalBins;
        this.binInfo = binInfo;
    }
}