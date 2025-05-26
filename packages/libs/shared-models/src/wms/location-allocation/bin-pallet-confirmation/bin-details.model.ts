
export class BinDetailsModel {
    binId: number;
    binCode: string;
    binDesc: string;
    totalSupportedPallets: number;
    totalFilledPallets: number;
    emptyPallets: number; // not sent all the times
    rackId: number;
    rackCode: string;
    trolleyIds: string[];

    constructor(binId: number,binCode: string,binDesc: string,totalSupportedPallets: number,totalFilledPallets: number,emptyPallets: number, rackId: number, rackCode: string,  trolleyIds?: string[]) {
        this.binId = binId;
        this.binCode = binCode;
        this.binDesc = binDesc;
        this.totalSupportedPallets = totalSupportedPallets;
        this.totalFilledPallets = totalFilledPallets;
        this.emptyPallets = emptyPallets;
        this.rackId = rackId;
        this.rackCode = rackCode;
        this.trolleyIds = trolleyIds;
    }
}
