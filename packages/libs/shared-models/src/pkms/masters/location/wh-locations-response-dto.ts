export class WareHouseLocationsResponseDto {
    locationId: number;
    locationCode: string;
    locationName: string;
    constructor(
        locationId: number,
        locationCode: string,
        locationName: string,
    ) {
        this.locationId = locationId
        this.locationCode = locationCode
        this.locationName = locationName
    }
}