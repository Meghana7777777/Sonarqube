
export class LocationDetailsModel {
    locationId: number;
    locationCode: string;
    locationBarCode: string;
    locationDesc: string;
    totalSupportedContainers: number;
    totalFilledContainers: number;
    emptyContainers: number; // not sent all the times
    rackId: number;
    rackCode: string;
    level: number;
    column: number;
    tcartoneyIds: string[];


    constructor(locationId: number, locationCode: string, locationBarCode: string, locationDesc: string, totalSupportedContainers: number, totalFilledContainers: number, emptyContainers: number, rackId: number, rackCode: string, level: number, column: number, tcartoneyIds?: string[]) {
        this.locationId = locationId;
        this.locationCode = locationCode;
        this.locationDesc = locationDesc;
        this.totalSupportedContainers = totalSupportedContainers;
        this.totalFilledContainers = totalFilledContainers;
        this.emptyContainers = emptyContainers;
        this.rackId = rackId;
        this.rackCode = rackCode;
        this.locationBarCode = locationBarCode;
        this.level = level;
        this.column = column;
        this.tcartoneyIds = tcartoneyIds;
    }
}
