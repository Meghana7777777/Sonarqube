export class MoDataForSoSummaryModel {
    moPslId: number[]; // PK of the mo sub line
    // soPslId: number; // PK of the  so sub line
    moSlQty: number; // Mo sl qty
    // soLineId: number;
    moLineId: number; //
    // soProdId: number; 
    moProdId: number; 
    size: string;
    fgColor: string;
    productName: string; // 
    moNumber: string; //
    soNumber: string;
    soLine: string;
    moLine: string;
    constructor(moPslId: number[], moSlQty: number,  moLineId: number,  moProdId: number, size: string, fgColor: string, productName: string, moNumber: string, soNumber: string, soLine: string, moLine: string) {
        this.moPslId = moPslId;
        // this.soPslId = soPslId; //
        this.moSlQty = moSlQty;
        // this.soLineId = soLineId; //
        this.moLineId = moLineId; 
        // this.soProdId = soProdId; //
        this.moProdId = moProdId;
        this.size = size;
        this.fgColor = fgColor;
        this.productName = productName;
        this.moNumber = moNumber;
        this.soNumber = soNumber;
        this.soLine = soLine;
        this.moLine = moLine;
    }
} 