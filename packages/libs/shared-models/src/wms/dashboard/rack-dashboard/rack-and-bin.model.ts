import { RollInfoModel } from "../../packing-list";

export class RackAndBinModel{
    rackId: number;
    rackBarcode: string;
    rackCode: string;
    rackName: string;
    rackLevel: number;
    rackcolumn: number;
    binData: BinModel[]; 
    
    constructor(rackId: number, rackBarcode: string,rackCode: string,rackName: string,rackLevel: number,rackcolumn: number,binData: BinModel[]) {
        this.rackId = rackId;
        this.rackBarcode = rackBarcode;
        this.rackCode = rackCode;
        this.rackName = rackName;
        this.rackLevel = rackLevel;
        this.rackcolumn = rackcolumn;
        this.binData = binData;
    }        
}

export class BinModel{
    binId: number;
    binBarcode: string;
    binCode: string;
    binName: string;
    binLevel: number;
    binColumn: number;
    palletCount: number;
    constructor(binId: number, binBarcode: string, binCode: string,binName: string,binLevel: number,binColumn: number,palletCount: number) {
        this.binId = binId;
        this.binBarcode = binBarcode;
        this.binCode = binCode;
        this.binName = binName;
        this.binLevel = binLevel;
        this.binColumn = binColumn;
        this.palletCount = palletCount;
    } 
    // palletDetails: palletData[];
}


