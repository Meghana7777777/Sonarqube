

export class FgRacksAndLocationModel{
    rackId: number;
    rackBarcode: string;
    rackCode: string;
    rackName: string;
    rackLevel: number;
    rackColumn: number;
    locationData: FgLocationModel[]; 
    
    constructor(rackId: number, rackBarcode: string,rackCode: string,rackName: string,rackLevel: number,rackColumn: number,locationData: FgLocationModel[]) {
        this.rackId = rackId;
        this.rackBarcode = rackBarcode;
        this.rackCode = rackCode;
        this.rackName = rackName;
        this.rackLevel = rackLevel;
        this.rackColumn = rackColumn;
        this.locationData = locationData;
    }        
}

export class FgLocationModel{
    locationId: number;
    locationBarcode: string;
    locationCode: string;
    locationName: string;
    locationLevel: number;
    locationColumn: number;
    palletCount: number;
    constructor(locationId: number, locationBarcode: string, locationCode: string,locationName: string,locationLevel: number,locationColumn: number,palletCount: number) {
        this.locationId = locationId;
        this.locationBarcode = locationBarcode;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.locationLevel = locationLevel;
        this.locationColumn = locationColumn;
        this.palletCount = palletCount;
    }
}


