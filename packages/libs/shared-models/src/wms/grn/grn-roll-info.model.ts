import { RollInfoModel } from "../packing-list";

export class GrnRollInfoModel  {
    pgName: string;
    pgId: number;
    defaultPalletId: number;
    defaultPalletName: string;
    currentPalletId: number;
    currentPalletName: string;
    rollInfo: RollInfoModel;
    
    /**
     * 
     * @param pgName 
     * @param pgId 
     * @param defaultPalletId 
     * @param defaultPalletName 
     * @param currentPalletId 
     * @param currentPalletName 
     * @param rollInfo 
     */
    constructor(pgName: string, pgId: number, defaultPalletId: number, defaultPalletName: string, currentPalletId: number, currentPalletName: string, rollInfo: RollInfoModel) {
        this.pgName = pgName;
        this.pgId = pgId;
        this.defaultPalletId = defaultPalletId;
        this.defaultPalletName = defaultPalletName;
        this.currentPalletId = currentPalletId;
        this.currentPalletName = currentPalletName;
        this.rollInfo = rollInfo;
    }
}