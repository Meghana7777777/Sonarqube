export class AssetsLocationsCreateDto {
    locationType: AssetLocationType;
    locationName: string;
    plant?: number;
    locationHead?: string
    supervisorName?: string;
    constructor(
        locationType: AssetLocationType,
        locationName: string,
        plant?: number,
        locationHead?: string,
        supervisorName?: string,
    ) {
        this.locationType = locationType;
        this.locationName = locationName;
        this.plant = plant;
        this.locationHead = locationHead;
        this.supervisorName = supervisorName;
    }
}


export enum AssetLocationType {
    Warehouse = 'Warehouse',
    Operations = 'Operations'
}